/**
 * Payment Provider Interfaces
 * 
 * These interfaces define the contracts for payment operations
 * and can be reused across different payment providers
 */

export interface PaymentInitializeResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  paidAt?: Date;
  customer?: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  metadata?: any;
}

export interface PaymentRefundResponse {
  success: boolean;
  reference: string;
  refundedAmount: number;
  message: string;
}

export interface PaymentInitializeDto {
  email: string;
  amount: number; // Amount in smallest currency unit (kobo for NGN, cents for USD)
  currency?: string;
  reference?: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface PaymentRefundDto {
  reference: string;
  amount?: number; // Optional: partial refund amount
  reason?: string;
}
