/**
 * Payment Provider Interface
 * 
 * This interface defines the contract that all payment providers must implement.
 * It allows for easy switching between different payment providers (Paystack, Flutterwave, etc.)
 */

import {
  PaymentInitializeResponse,
  PaymentVerifyResponse,
  PaymentRefundResponse,
  PaymentInitializeDto,
  PaymentRefundDto,
} from '../../../common/interfaces';

export abstract class PaymentProvider {
  /**
   * Initialize a payment transaction
   * @param data Payment initialization data
   * @returns Payment initialization response with authorization URL
   */
  abstract initializePayment(
    data: PaymentInitializeDto,
  ): Promise<PaymentInitializeResponse>;

  /**
   * Verify a payment transaction
   * @param reference Payment reference to verify
   * @returns Payment verification response
   */
  abstract verifyPayment(
    reference: string,
  ): Promise<PaymentVerifyResponse>;

  /**
   * Refund a payment transaction
   * @param data Refund data
   * @returns Refund response
   */
  abstract refundPayment(
    data: PaymentRefundDto,
  ): Promise<PaymentRefundResponse>;

  /**
   * Get payment details
   * @param reference Payment reference
   * @returns Payment details
   */
  abstract getPaymentDetails(reference: string): Promise<any>;
}
