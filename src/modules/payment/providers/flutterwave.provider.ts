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
 * Flutterwave Payment Provider
 * 
 * Implements the PaymentProvider interface for Flutterwave
 * Documentation: https://developer.flutterwave.com/docs
 * 
 * Required Environment Variables:
 * - FLUTTERWAVE_SECRET_KEY: Your Flutterwave secret key
 * - FLUTTERWAVE_PUBLIC_KEY: Your Flutterwave public key (optional, for frontend)
 * - FLUTTERWAVE_ENCRYPTION_KEY: Your Flutterwave encryption key
 */
@Injectable()
export class FlutterwaveProvider extends PaymentProvider {
  private readonly baseUrl = 'https://api.flutterwave.com/v3';
  private readonly secretKey: string;

  constructor(private configService: ConfigService) {
    super();
    // Get secret key from configuration structure (payment.flutterwave.secretKey)
    // Falls back to direct env variable for backward compatibility
    const secretKey = 
      this.configService.get<string>('payment.flutterwave.secretKey') ||
      this.configService.get<string>('FLUTTERWAVE_SECRET_KEY');
    
    if (!secretKey) {
      throw new Error('FLUTTERWAVE_SECRET_KEY is not configured. Please set it in your .env file.');
    }
    
    this.secretKey = secretKey;
  }

  /**
   * Initialize a payment transaction with Flutterwave
   */
  async initializePayment(
    data: PaymentInitializeDto,
  ): Promise<PaymentInitializeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_ref: data.reference || this.generateReference(),
          amount: data.amount / 100, // Convert from kobo to naira
          currency: data.currency || 'NGN',
          redirect_url: data.callbackUrl,
          payment_options: 'card,mobilemoney,ussd,banktransfer',
          customer: {
            email: data.email,
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
            phonenumber: data.phone,
          },
          customizations: {
            title: 'Payment',
            description: 'Payment for services',
          },
          meta: data.metadata,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.status !== 'success') {
        throw new HttpException(
          result.message || 'Failed to initialize payment',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        authorizationUrl: result.data.link,
        accessCode: result.data.access_code || '',
        reference: data.reference || result.data.tx_ref,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to initialize payment with Flutterwave',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Verify a payment transaction with Flutterwave
   */
  async verifyPayment(reference: string): Promise<PaymentVerifyResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/transactions/verify_by_reference?tx_ref=${reference}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok || result.status !== 'success') {
        throw new HttpException(
          result.message || 'Failed to verify payment',
          HttpStatus.BAD_REQUEST,
        );
      }

      const data = result.data;

      return {
        success: data.status === 'successful',
        reference: data.tx_ref,
        amount: parseFloat(data.amount),
        currency: data.currency,
        status: data.status,
        paidAt: data.created_at ? new Date(data.created_at) : undefined,
        customer: {
          email: data.customer.email,
          firstName: data.customer.name?.split(' ')[0],
          lastName: data.customer.name?.split(' ')[1],
        },
        metadata: data.meta,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to verify payment with Flutterwave',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Refund a payment transaction with Flutterwave
   */
  async refundPayment(data: PaymentRefundDto): Promise<PaymentRefundResponse> {
    try {
      // First, get the transaction ID from the reference
      const transactionDetails = await this.getPaymentDetails(data.reference);
      const transactionId = transactionDetails.id;

      const response = await fetch(`${this.baseUrl}/transactions/${transactionId}/refund`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount ? data.amount / 100 : undefined, // Optional: partial refund
          comments: data.reason,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.status !== 'success') {
        throw new HttpException(
          result.message || 'Failed to process refund',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        success: true,
        reference: data.reference,
        refundedAmount: data.amount ? data.amount / 100 : parseFloat(transactionDetails.amount),
        message: result.message,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to process refund with Flutterwave',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get payment details from Flutterwave
   */
  async getPaymentDetails(reference: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/transactions/verify_by_reference?tx_ref=${reference}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok || result.status !== 'success') {
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
        'Failed to get payment details from Flutterwave',
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
    return `FLW_${timestamp}_${random}`.toUpperCase();
  }
}
