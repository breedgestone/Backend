import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentProvider } from './payment-provider.interface';
import {
  PaymentInitializeDto,
  PaymentInitializeResponse,
  PaymentVerifyResponse,
  PaymentRefundDto,
  PaymentRefundResponse,
} from '../../../common/interfaces';
import { ConfigService } from '@nestjs/config';

/**
 * Paystack Payment Provider
 * 
 * Implements the PaymentProvider interface for Paystack
 * Documentation: https://paystack.com/docs/api/
 * 
 * Required Environment Variables:
 * - PAYSTACK_SECRET_KEY: Your Paystack secret key
 * - PAYSTACK_PUBLIC_KEY: Your Paystack public key (optional, for frontend)
 */
@Injectable()
export class PaystackProvider extends PaymentProvider {
  private readonly baseUrl = 'https://api.paystack.co';
  private readonly secretKey: string;

  constructor(private configService: ConfigService) {
    super();
    // Get secret key from configuration structure (payment.paystack.secretKey)
    // Falls back to direct env variable for backward compatibility
    const secretKey = 
      this.configService.get<string>('payment.paystack.secretKey') ||
      this.configService.get<string>('PAYSTACK_SECRET_KEY');
    
    if (!secretKey) {
      throw new Error('PAYSTACK_SECRET_KEY is not configured. Please set it in your .env file.');
    }
    
    this.secretKey = secretKey;
  }

  /**
   * Initialize a payment transaction with Paystack
   */
  async initializePayment(
    data: PaymentInitializeDto,
  ): Promise<PaymentInitializeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          amount: data.amount, // Amount in kobo (smallest unit)
          currency: data.currency || 'NGN',
          reference: data.reference || this.generateReference(),
          callback_url: data.callbackUrl,
          metadata: data.metadata,
          channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.status) {
        throw new HttpException(
          result.message || 'Failed to initialize payment',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        authorizationUrl: result.data.authorization_url,
        accessCode: result.data.access_code,
        reference: result.data.reference,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to initialize payment with Paystack',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Verify a payment transaction with Paystack
   */
  async verifyPayment(reference: string): Promise<PaymentVerifyResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok || !result.status) {
        throw new HttpException(
          result.message || 'Failed to verify payment',
          HttpStatus.BAD_REQUEST,
        );
      }

      const data = result.data;

      return {
        success: data.status === 'success',
        reference: data.reference,
        amount: data.amount / 100, // Convert from kobo to naira
        currency: data.currency,
        status: data.status,
        paidAt: data.paid_at ? new Date(data.paid_at) : undefined,
        customer: {
          email: data.customer.email,
          firstName: data.customer.first_name,
          lastName: data.customer.last_name,
        },
        metadata: data.metadata,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to verify payment with Paystack',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Refund a payment transaction with Paystack
   */
  async refundPayment(data: PaymentRefundDto): Promise<PaymentRefundResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/refund`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction: data.reference,
          amount: data.amount, // Optional: partial refund in kobo
          currency: 'NGN',
          customer_note: data.reason,
          merchant_note: data.reason,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.status) {
        throw new HttpException(
          result.message || 'Failed to process refund',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        success: true,
        reference: data.reference,
        refundedAmount: data.amount ? data.amount / 100 : 0,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to process refund with Paystack',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get payment details from Paystack
   */
  async getPaymentDetails(reference: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok || !result.status) {
        throw new HttpException(
          result.message || 'Failed to get payment details',
          HttpStatus.BAD_REQUEST,
        );
      }

      return result.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get payment details from Paystack',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Generate a unique payment reference
   */
  private generateReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `PAY_${timestamp}_${random}`.toUpperCase();
  }
}
