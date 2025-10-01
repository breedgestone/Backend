import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Order, OrderItem } from './entities';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { ProductsService } from '../products/products.service';
import { CartService } from '../cart/cart.service';

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
}
