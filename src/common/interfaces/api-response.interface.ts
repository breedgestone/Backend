/**
 * API Response wrapper interface
 * Used for standardizing all API responses
 */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
