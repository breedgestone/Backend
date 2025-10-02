import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Order, OrderItem } from './entities';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { ProductsService } from '../products/products.service';
import { CartService } from '../cart/cart.service';
import { PaymentService } from '../../payment/payment.service';
import { PaymentType } from '../../payment/dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private productsService: ProductsService,
    @Inject(forwardRef(() => CartService))
    private cartService: CartService,
    private readonly paymentService: PaymentService,
  ) {}

  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }

  async createOrder(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    // Calculate totals
    let itemsTotal = 0;

    // Validate all products exist and calculate total
    for (const item of createOrderDto.items) {
      const product = await this.productsService.findProductById(item.productId);
      itemsTotal += (product.price || 0) * item.quantity;
    }

    const deliveryFee = createOrderDto.deliveryFee || 0;
    const tax = createOrderDto.tax || 0;
    const totalAmount = itemsTotal + deliveryFee + tax;

    // Create order
    const order = this.orderRepository.create({
      userId,
      orderNumber: this.generateOrderNumber(),
      deliveryAddress: createOrderDto.deliveryAddress,
      deliveryFee: createOrderDto.deliveryFee,
      tax: createOrderDto.tax,
      totalAmount,
      status: 'pending',
      paymentMethod: createOrderDto.paymentMethod,
      note: createOrderDto.note,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    for (const item of createOrderDto.items) {
      const product = await this.productsService.findProductById(item.productId);
      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price || 0,
      });
      await this.orderItemRepository.save(orderItem);
    }

    // Clear user's cart
    await this.cartService.clearCart(userId);

    return await this.findOrderById(savedOrder.id);
  }

  async findAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['user', 'orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findUserOrders(userId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId, deletedAt: IsNull() },
      relations: ['orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['user', 'orderItems', 'orderItems.product'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOrderById(id);
    Object.assign(order, updateOrderDto);
    return await this.orderRepository.save(order);
  }

  async cancelOrder(userId: number, id: number): Promise<Order> {
    const order = await this.findOrderById(id);

    if (order.userId !== userId) {
      throw new BadRequestException('You can only cancel your own orders');
    }

    if (order.status !== 'pending') {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    order.status = 'cancelled';
    return await this.orderRepository.save(order);
  }

  /**
   * Initialize payment for order
   * Simply calls payment service - all logic handled there
   */
  async initializeOrderPayment(orderId: number, userId: number) {
    const order = await this.findOrderById(orderId);

    if (order.userId !== userId) {
      throw new BadRequestException('You can only pay for your own orders');
    }

    if (order.status !== 'pending') {
      throw new BadRequestException('Payment can only be initialized for pending orders');
    }

    if (order.paymentReference) {
      throw new BadRequestException('Payment already initialized for this order');
    }

    // Get user details
    const userEmail = order.user?.email || '';
    const firstName = order.user?.firstName;
    const lastName = order.user?.lastName;
    const phone = order.user?.phone;

    // Let payment service handle everything
    const paymentSession = await this.paymentService.createPaymentSession({
      paymentType: PaymentType.ORDER,
      entityId: order.id,
      userId: order.userId,
      amount: order.totalAmount,
      email: userEmail,
      firstName,
      lastName,
      phone,
      metadata: {
        orderNumber: order.orderNumber,
        itemsCount: order.orderItems?.length || 0,
      },
    });

    // Store reference locally for quick lookup
    order.paymentReference = paymentSession.reference;
    order.paymentStatus = 'pending';
    await this.orderRepository.save(order);

    return {
      order,
      payment: paymentSession,
    };
  }

  /**
   * Check payment status and update order if paid
   * Can be called manually or via cron job
   */
  async checkOrderPaymentStatus(orderId: number) {
    const order = await this.findOrderById(orderId);

    if (!order.paymentReference) {
      throw new BadRequestException('No payment reference found for this order');
    }

    // Check payment status from payment service
    const payment = await this.paymentService.getPaymentByReference(order.paymentReference);

    // Update order status based on payment status
    if (payment.status === 'success' && order.status === 'pending') {
      order.paymentStatus = 'paid';
      order.status = 'processing';
      await this.orderRepository.save(order);
    } else if (payment.status === 'failed') {
      order.paymentStatus = 'failed';
      await this.orderRepository.save(order);
    }

    return {
      order,
      paymentStatus: payment.status,
    };
  }
}
