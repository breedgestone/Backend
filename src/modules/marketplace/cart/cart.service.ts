import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartProduct } from './entities';
import { AddToCartDto, UpdateCartItemDto, CheckoutDto } from './dto';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartProduct)
    private cartProductRepository: Repository<CartProduct>,
    private productsService: ProductsService,
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService,
  ) {}

  async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['cartProducts', 'cartProducts.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addToCart(userId: number, addToCartDto: AddToCartDto): Promise<Cart> {
    // Verify product exists
    const product = await this.productsService.findProductById(addToCartDto.productId);

    if (addToCartDto.subCategoryId) {
      if (!product.subCategoryId) {
        throw new BadRequestException(
          `Product does not belong to any subcategory`
        );
      }
      
      const productSubCategoryId = Number(product.subCategoryId);
      const requestedSubCategoryId = Number(addToCartDto.subCategoryId);
      
      if (productSubCategoryId !== requestedSubCategoryId) {
        throw new BadRequestException(
          `Product does not belong to subcategory`
        );
      }
    }

    // Get or create cart
    const cart = await this.getOrCreateCart(userId);

    // Check if product already in cart with same subcategory
    const existingCartProduct = await this.cartProductRepository.findOne({
      where: {
        cartId: cart.id,
        productId: addToCartDto.productId,
        subCategoryId: addToCartDto.subCategoryId || product.subCategoryId,
      },
    });

    if (existingCartProduct) {
      // Update quantity
      existingCartProduct.quantity += addToCartDto.quantity;
      await this.cartProductRepository.save(existingCartProduct);
    } else {
      // Add new cart product with validated subCategoryId
      const cartProduct = this.cartProductRepository.create({
        cartId: cart.id,
        productId: addToCartDto.productId,
        quantity: addToCartDto.quantity,
        subCategoryId: addToCartDto.subCategoryId || product.subCategoryId,
      });
      await this.cartProductRepository.save(cartProduct);
    }

    return await this.getOrCreateCart(userId);
  }

  async getCart(userId: number): Promise<Cart> {
    return await this.getOrCreateCart(userId);
  }

  async updateCartItem(
    userId: number,
    productId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const cartProduct = await this.cartProductRepository.findOne({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!cartProduct) {
      throw new NotFoundException(`Product ${productId} not found in cart`);
    }

    cartProduct.quantity = updateCartItemDto.quantity;
    await this.cartProductRepository.save(cartProduct);

    return await this.getOrCreateCart(userId);
  }

  async removeFromCart(userId: number, productId: number): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const cartProduct = await this.cartProductRepository.findOne({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!cartProduct) {
      throw new NotFoundException(`Product ${productId} not found in cart`);
    }

    await this.cartProductRepository.remove(cartProduct);

    return await this.getOrCreateCart(userId);
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.getOrCreateCart(userId);

    await this.cartProductRepository.delete({ cartId: cart.id });
  }

  async checkout(userId: number, checkoutDto: CheckoutDto): Promise<Order> {
    // Get user's cart with items
    const cart = await this.getOrCreateCart(userId);

    if (!cart.cartProducts || cart.cartProducts.length === 0) {
      throw new BadRequestException('Cart is empty. Cannot checkout with no items.');
    }

    // Build order items from cart products
    const orderItems = cart.cartProducts.map(cartProduct => {
      if (!cartProduct.productId) {
        throw new BadRequestException('Invalid cart product');
      }
      return {
        productId: cartProduct.productId,
        quantity: cartProduct.quantity,
        price: cartProduct.product?.price || 0,
      };
    });

    // Create order using OrdersService
    const order = await this.ordersService.createOrder(userId, {
      deliveryAddress: checkoutDto.deliveryAddress,
      items: orderItems,
      paymentMethod: checkoutDto.paymentMethod,
      deliveryFee: checkoutDto.deliveryFee,
      tax: checkoutDto.tax,
      note: checkoutDto.note,
    });

    return order;
  }
}
