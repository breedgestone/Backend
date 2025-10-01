/**
 * Error Response interface
 * Used by HTTP exception filter
 */
export interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  errors?: any[];
}
