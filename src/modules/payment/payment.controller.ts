import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Query,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InitializePaymentDto, RefundPaymentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentTransaction } from './entities';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    @InjectRepository(PaymentTransaction)
    private paymentTransactionRepository: Repository<PaymentTransaction>,
  ) {}

  /**
   * Initialize a payment transaction
   */
  @Post('initialize')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initialize a payment transaction' })
  @ApiResponse({
    status: 200,
    description: 'Payment initialized successfully',
    schema: {
      example: {
        success: true,
        data: {
          authorizationUrl: 'https://checkout.paystack.com/xyz',
          accessCode: 'xyz123',
          reference: 'PAY_1234567890_ABC',
        },
        message: 'Payment initialized successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid payment data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  async initializePayment(@Body() initializeDto: InitializePaymentDto) {
    return this.paymentService.initializePayment(initializeDto);
  }

  /**
   * Verify a payment transaction
   */
  @Get('verify/:reference')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify a payment transaction' })
  @ApiResponse({
    status: 200,
    description: 'Payment verified successfully',
    schema: {
      example: {
        success: true,
        data: {
          success: true,
          reference: 'PAY_1234567890_ABC',
          amount: 500,
          currency: 'NGN',
          status: 'success',
          paidAt: '2024-01-15T10:30:00.000Z',
          customer: {
            email: 'customer@example.com',
            firstName: 'John',
            lastName: 'Doe',
          },
          metadata: { orderId: 123 },
        },
        message: 'Payment verified successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid reference or verification failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  async verifyPayment(@Param('reference') reference: string) {
    return this.paymentService.verifyPayment(reference);
  }

  /**
   * Process a refund for a payment
   */
  @Post('refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process a payment refund' })
  @ApiResponse({
    status: 200,
    description: 'Refund processed successfully',
    schema: {
      example: {
        success: true,
        data: {
          success: true,
          reference: 'PAY_1234567890_ABC',
          refundedAmount: 250,
          message: 'Refund processed successfully',
        },
        message: 'Refund processed successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid refund data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  async refundPayment(@Body() refundDto: RefundPaymentDto) {
    return this.paymentService.refundPayment(refundDto);
  }

  /**
   * Get payment details
   */
  @Get('details/:reference')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment transaction details' })
  @ApiResponse({
    status: 200,
    description: 'Payment details retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid reference',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  async getPaymentDetails(@Param('reference') reference: string) {
    return this.paymentService.getPaymentDetails(reference);
  }

  /**
   * Get current payment provider name
   */
  @Get('provider')
  @ApiOperation({ summary: 'Get current payment provider name' })
  @ApiResponse({
    status: 200,
    description: 'Payment provider retrieved successfully',
    schema: {
      example: {
        provider: 'paystack',
      },
    },
  })
  getProvider() {
    return {
      provider: this.paymentService.getProviderName(),
    };
  }

  /**
   * UNIFIED Payment Callback - Handles ALL payment types
   * Single endpoint for inspections, consultations, orders, etc.
   * 
   * This is the ONLY callback endpoint - payment provider redirects here
   * Payment service automatically:
   * 1. Verifies payment with provider (Paystack/Flutterwave)
   * 2. Updates payment_transactions table
   * 3. Returns success/failure
   * 
   * Entity modules can then query payment status and update their own entities
   */
  @Get('callback')
  @ApiOperation({ 
    summary: 'Unified payment callback for ALL payment types',
    description: 'Single webhook endpoint for all payments (inspections, consultations, orders, etc.). Payment provider redirects here after user completes payment. Automatically verifies and stores result.'
  })
  @ApiResponse({
    status: 200,
    description: 'Payment verified successfully',
    schema: {
      example: {
        success: true,
        reference: 'PAY_INSP_123_1234567890',
        entityId: 123,
        entityType: 'inspection',
        amount: 500000,
        status: 'success',
        message: 'Payment verified successfully. Your inspection has been scheduled.',
        redirectUrl: '/appointments/inspections/123'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Payment verification failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment transaction not found',
  })
  async paymentCallback(@Query('reference') reference: string) {
    // Payment service verifies and stores result
    const result = await this.paymentService.verifyPaymentTransaction(reference);
    
    // Dynamic messages based on payment type
    const messages = {
      inspection: 'Payment verified successfully. Your inspection has been scheduled.',
      consultation: 'Payment verified successfully. Your consultation has been scheduled.',
      order: 'Payment verified successfully. Your order is being processed.',
    };

    // Frontend redirect URLs
    const redirectUrls = {
      inspection: `/appointments/inspections/${result.entityId}`,
      consultation: `/appointments/consultations/${result.entityId}`,
      order: `/orders/${result.entityId}`,
    };

    return {
      success: result.success,
      reference: result.reference,
      entityId: result.entityId,
      entityType: result.entityType,
      amount: result.amount,
      status: result.status,
      message: result.success 
        ? (messages[result.entityType] || 'Payment verified successfully')
        : 'Payment verification failed',
      redirectUrl: result.success ? redirectUrls[result.entityType] : null,
    };
  }

  /**
   * Get payment transaction by reference
   */
  @Get('transaction/:reference')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment transaction details' })
  @ApiResponse({
    status: 200,
    description: 'Transaction retrieved successfully',
  })
  async getTransaction(@Param('reference') reference: string) {
    return this.paymentService.getPaymentByReference(reference);
  }
}
