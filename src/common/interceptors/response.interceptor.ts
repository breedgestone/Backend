import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp?: string;
  path?: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data) => {
        // Extract message if it exists in the response data
        let message = 'Success';
        let responseData = data;

        // If the controller returns an object with a 'message' field, use it
        if (data && typeof data === 'object' && 'message' in data) {
          message = data.message;
          // Remove message from data if it exists, or use the whole object as data
          if (Object.keys(data).length > 1) {
            const { message: _, ...rest } = data;
            responseData = rest;
          }
        }

        return {
          statusCode: response.statusCode,
          message,
          data: responseData,
        };
      }),
    );
  }
}
