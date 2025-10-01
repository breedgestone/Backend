import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { ApiResponse } from '../interfaces';

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

        // If the controller returns an object with ONLY a 'message' field, use it as the message
        // Otherwise, treat the entire object as data (including entities with message properties)
        if (data && typeof data === 'object' && 'message' in data && Object.keys(data).length === 1) {
          message = data.message;
          responseData = null;
        } else if (data && typeof data === 'object' && 'message' in data && !('id' in data)) {
          // If it has message but no id (not an entity), extract the message
          message = data.message;
          const { message: _, ...rest } = data;
          responseData = Object.keys(rest).length > 0 ? rest : null;
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
