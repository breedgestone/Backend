import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { Order } from './entities';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.ordersService.createOrder(req.user.id, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders (admin)' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  async findAllOrders(): Promise<Order[]> {
    return await this.ordersService.findAllOrders();
  }

  @Get('my-orders')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user orders' })
  @ApiResponse({ status: 200, description: 'User orders retrieved successfully' })
  async findUserOrders(@Request() req): Promise<Order[]> {
    return await this.ordersService.findUserOrders(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOrderById(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return await this.ordersService.findOrderById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order status (admin)' })
  @ApiResponse({ status: 200, description: 'Order successfully updated' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return await this.ordersService.updateOrder(id, updateOrderDto);
  }

  @Patch(':id/cancel')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel order (user can only cancel own pending orders)' })
  @ApiResponse({ status: 200, description: 'Order successfully cancelled' })
  @ApiResponse({ status: 400, description: 'Cannot cancel this order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async cancelOrder(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<Order> {
    return await this.ordersService.cancelOrder(req.user.id, id);
  }

  // Payment endpoints
  @Post(':id/initialize-payment')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Initialize payment for order',
    description: 'Generate payment link for order checkout. Works with any configured payment provider (Paystack/Flutterwave). After payment, user is redirected to /api/payment/callback which automatically updates the order status.'
  })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment initialized successfully',
    schema: {
      example: {
        order: {
          id: 1,
          orderNumber: 'ORD-1234567890-123',
          status: 'pending',
          totalAmount: 15000,
          paymentReference: 'PAY_ORD_1_1234567890',
          paymentStatus: 'pending'
        },
        payment: {
          authorizationUrl: 'https://checkout.paystack.com/abc123',
          reference: 'PAY_ORD_1_1234567890',
          amount: 1500000,
          currency: 'NGN'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid order status or payment already initialized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async initializeOrderPayment(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return await this.ordersService.initializeOrderPayment(id, req.user.id);
  }
}
