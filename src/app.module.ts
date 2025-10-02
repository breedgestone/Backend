import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ChatModule } from './modules/chat/chat.module';
import { CategoriesModule } from './modules/marketplace/categories/categories.module';
import { ProductsModule } from './modules/marketplace/products/products.module';
import { CartModule } from './modules/marketplace/cart/cart.module';
import { OrdersModule } from './modules/marketplace/orders/orders.module';
import { ReviewsModule } from './modules/marketplace/reviews/reviews.module';
import { PropertyModule } from './modules/property/property.module';
import { AdminModule } from './modules/admin/admin.module';
import { PaymentModule } from './modules/payment/payment.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    AuthModule, 
    UsersModule, 
    NotificationModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    ReviewsModule,
    ChatModule,
    PropertyModule,
    AdminModule,
    PaymentModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
