import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto, CheckoutDto } from './dto';
import { Cart } from './entities';
import { Order } from '../orders/entities/order.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  async getCart(@Request() req): Promise<Cart> {
    return await this.cartService.getCart(req.user.id);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add product to cart' })
  @ApiResponse({ status: 200, description: 'Product added to cart successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto): Promise<Cart> {
    return await this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Patch('item/:productId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found in cart' })
  async updateCartItem(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    return await this.cartService.updateCartItem(req.user.id, productId, updateCartItemDto);
  }

  @Delete('item/:productId')
  @ApiOperation({ summary: 'Remove product from cart' })
  @ApiResponse({ status: 200, description: 'Product removed from cart successfully' })
  @ApiResponse({ status: 404, description: 'Product not found in cart' })
  async removeFromCart(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<Cart> {
    return await this.cartService.removeFromCart(req.user.id, productId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  async clearCart(@Request() req): Promise<void> {
    return await this.cartService.clearCart(req.user.id);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Checkout and create order from cart' })
  @ApiResponse({ status: 201, description: 'Order created successfully from cart' })
  @ApiResponse({ status: 400, description: 'Cart is empty or invalid data' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async checkout(@Request() req, @Body() checkoutDto: CheckoutDto): Promise<Order> {
    return await this.cartService.checkout(req.user.id, checkoutDto);
  }
}
