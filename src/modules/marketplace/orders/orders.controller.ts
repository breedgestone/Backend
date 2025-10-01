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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
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
}
