import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderItem } from './entities';
import { ProductsModule } from '../products/products.module';
import { CartModule } from '../cart/cart.module';
import { PaymentModule } from '../../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ProductsModule,
    forwardRef(() => CartModule),
    forwardRef(() => PaymentModule),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService, TypeOrmModule],
})
export class OrdersModule {}
