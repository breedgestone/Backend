import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart, CartProduct } from './entities';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartProduct]),
    ProductsModule,
    forwardRef(() => OrdersModule),
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService, TypeOrmModule],
})
export class CartModule {}
