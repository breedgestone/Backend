import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaystackProvider, FlutterwaveProvider } from './providers';
import { PaymentTransaction } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentTransaction]),
    ConfigModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaystackProvider, FlutterwaveProvider],
  exports: [PaymentService, TypeOrmModule],
})
export class PaymentModule {}
