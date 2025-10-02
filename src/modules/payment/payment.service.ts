import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  PaymentProvider,
  PaystackProvider,
  FlutterwaveProvider,
} from './providers';
import {
  InitializePaymentDto,
  RefundPaymentDto,
  CreatePaymentSessionDto,
  PaymentType,
} from './dto';
import { PaymentTransaction } from './entities';
import { PaymentSessionResponse, PaymentVerificationResponse } from './dto/payment-session-response.dto';

/**
 * Payment Service
 * 
 * Centralized payment handler - manages all payment logic for the entire application.
 * Other modules simply call this service with minimal data and get back results.
 * 
 * Features:
 * - Automatic provider switching (Paystack/Flutterwave) via DI
 * - Tracks all transactions in database
 * - Generates unique references
 * - Handles callbacks and verification
 * - Provides simple API for other modules
 * 
 * Environment Variables:
 * - PAYMENT_PROVIDER: 'paystack' or 'flutterwave' (default: 'paystack')
 * - PAYMENT_CALLBACK_URL: Base URL for payment callbacks
 * - APP_URL: Application base URL
 */
@Injectable()
export class PaymentService {
  private readonly provider: PaymentProvider;
  private readonly providerName: string;

  constructor(
    @InjectRepository(PaymentTransaction)
    private paymentTransactionRepository: Repository<PaymentTransaction>,
    private readonly configService: ConfigService,
    private readonly paystackProvider: PaystackProvider,
    private readonly flutterwaveProvider: FlutterwaveProvider,
  ) {
    // Select provider based on configuration
    // Try configuration structure first, fallback to direct env variable
    this.providerName = 
      this.configService.get<string>('payment.provider') ||
      this.configService.get<string>('PAYMENT_PROVIDER', 'paystack');
    
    switch (this.providerName.toLowerCase()) {
      case 'paystack':
        this.provider = this.paystackProvider;
        break;
      case 'flutterwave':
        this.provider = this.flutterwaveProvider;
        break;
      default:
        throw new Error(
          `Invalid payment provider: ${this.providerName}. Must be 'paystack' or 'flutterwave'`,
        );
    }
  }

  /**
   * Generate unique payment reference based on type
   */
  private generateReference(paymentType: PaymentType, entityId: number): string {
    const prefix = {
      [PaymentType.INSPECTION]: 'PAY_INSP',
      [PaymentType.CONSULTATION]: 'PAY_CONS',
      [PaymentType.ORDER]: 'PAY_ORD',
    }[paymentType];

    return `${prefix}_${entityId}_${Date.now()}`;
  }

  /**
   * Get unified callback URL for all payments
   */
  private getCallbackUrl(): string {
    // Get app URL and global prefix from configuration
    const baseUrl = this.configService.get<string>('app.url', 'http://localhost:3000');
    const apiPrefix = this.configService.get<string>('app.globalPrefix', 'api/v1');
    return `${baseUrl}/${apiPrefix}/payment/callback`;
  }

  /**
   * Initialize a payment transaction
   * Returns authorization URL to redirect user for payment
   */
  async initializePayment(data: InitializePaymentDto) {
    try {
      const result = await this.provider.initializePayment(data);
      
      return {
        success: true,
        data: result,
        message: 'Payment initialized successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to initialize payment',
      );
    }
  }

  /**
   * Verify a payment transaction
   * Call this after payment callback to confirm payment status
   */
  async verifyPayment(reference: string) {
    try {
      const result = await this.provider.verifyPayment(reference);
      
      return {
        success: result.success,
        data: result,
        message: result.success
          ? 'Payment verified successfully'
          : 'Payment verification failed',
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to verify payment',
      );
    }
  }

  /**
   * Refund a payment transaction
   * Can be full or partial refund
   */
  async refundPayment(data: RefundPaymentDto) {
    try {
      const result = await this.provider.refundPayment(data);
      
      return {
        success: result.success,
        data: result,
        message: result.success
          ? 'Refund processed successfully'
          : 'Refund processing failed',
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to process refund',
      );
    }
  }

  /**
   * Get payment details
   * Retrieve full payment information
   */
  async getPaymentDetails(reference: string) {
    try {
      const result = await this.provider.getPaymentDetails(reference);
      
      return {
        success: true,
        data: result,
        message: 'Payment details retrieved successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to get payment details',
      );
    }
  }

  /**
   * Get current payment provider name
   */
  getProviderName(): string {
    return this.providerName.toLowerCase();
  }

  /**
   * CREATE PAYMENT SESSION
   * 
   * This is the main method other modules should use.
   * Just pass in the payment details and get back a payment link.
   * 
   * Usage:
   * ```typescript
   * const session = await paymentService.createPaymentSession({
   *   paymentType: PaymentType.INSPECTION,
   *   entityId: inspection.id,
   *   userId: user.id,
   *   amount: inspection.amount,
   *   email: inspection.email,
   *   firstName: inspection.firstName,
   *   lastName: inspection.lastName,
   * });
   * 
   * // Redirect user to: session.authorizationUrl
   * ```
   */
  async createPaymentSession(
    dto: CreatePaymentSessionDto,
  ): Promise<PaymentSessionResponse> {
    // Generate unique reference
    const reference = this.generateReference(dto.paymentType, dto.entityId);
    const callbackUrl = this.getCallbackUrl(); // Single callback for all payment types
    const amountKobo = Math.round(dto.amount * 100); // Convert to kobo/cents

    // Initialize payment with provider
    const providerResult = await this.provider.initializePayment({
      email: dto.email,
      amount: amountKobo,
      reference,
      callbackUrl,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      metadata: {
        ...dto.metadata,
        paymentType: dto.paymentType,
        entityId: dto.entityId,
        userId: dto.userId,
      },
    });

    // Store transaction in database
    const transaction = this.paymentTransactionRepository.create({
      reference,
      paymentType: dto.paymentType,
      entityId: dto.entityId,
      userId: dto.userId,
      amount: dto.amount,
      amountKobo,
      currency: 'NGN',
      status: 'pending',
      paymentProvider: this.providerName,
      authorizationUrl: providerResult.authorizationUrl,
      accessCode: providerResult.accessCode,
      customerEmail: dto.email,
      customerName: dto.firstName && dto.lastName 
        ? `${dto.firstName} ${dto.lastName}` 
        : undefined,
      customerPhone: dto.phone,
      metadata: dto.metadata,
    });

    await this.paymentTransactionRepository.save(transaction);

    return {
      reference,
      authorizationUrl: providerResult.authorizationUrl,
      accessCode: providerResult.accessCode,
      amount: amountKobo,
      currency: 'NGN',
      provider: this.providerName,
    };
  }

  /**
   * VERIFY PAYMENT
   * 
   * Verify a payment and update transaction status.
   * Call this from your callback endpoint.
   * 
   * Usage:
   * ```typescript
   * const result = await paymentService.verifyPaymentTransaction(reference);
   * if (result.success) {
   *   // Payment successful - update your entity
   *   await appointmentService.updateInspectionPayment(result.entityId, reference);
   * }
   * ```
   */
  async verifyPaymentTransaction(
    reference: string,
  ): Promise<PaymentVerificationResponse> {
    // Get transaction from database
    const transaction = await this.paymentTransactionRepository.findOne({
      where: { reference },
    });

    if (!transaction) {
      throw new NotFoundException(`Payment transaction not found: ${reference}`);
    }

    // If already verified, return cached result
    if (transaction.status === 'success') {
      return {
        success: true,
        reference: transaction.reference,
        amount: transaction.amountKobo,
        status: transaction.status,
        entityId: transaction.entityId,
        entityType: transaction.paymentType,
        paidAt: transaction.paidAt,
      };
    }

    // Verify with payment provider
    const verificationResult = await this.provider.verifyPayment(reference);

    // Update transaction
    transaction.status = verificationResult.success ? 'success' : 'failed';
    transaction.providerResponse = verificationResult as any;
    
    if (verificationResult.success) {
      transaction.paidAt = verificationResult.paidAt || new Date();
    }

    await this.paymentTransactionRepository.save(transaction);

    return {
      success: verificationResult.success,
      reference: transaction.reference,
      amount: transaction.amountKobo,
      status: transaction.status,
      entityId: transaction.entityId,
      entityType: transaction.paymentType,
      paidAt: transaction.paidAt,
    };
  }

  /**
   * GET PAYMENT BY REFERENCE
   * 
   * Retrieve payment transaction details
   */
  async getPaymentByReference(reference: string): Promise<PaymentTransaction> {
    const transaction = await this.paymentTransactionRepository.findOne({
      where: { reference },
    });

    if (!transaction) {
      throw new NotFoundException(`Payment transaction not found: ${reference}`);
    }

    return transaction;
  }

  /**
   * GET PAYMENTS BY ENTITY
   * 
   * Get all payments for a specific entity (inspection, order, etc.)
   */
  async getPaymentsByEntity(
    paymentType: PaymentType,
    entityId: number,
  ): Promise<PaymentTransaction[]> {
    return await this.paymentTransactionRepository.find({
      where: {
        paymentType,
        entityId,
      },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * GET USER PAYMENTS
   * 
   * Get all payments made by a user
   */
  async getUserPayments(userId: number): Promise<PaymentTransaction[]> {
    return await this.paymentTransactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
