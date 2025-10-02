import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { classToPlain } from 'class-transformer';
import { ApiResponse } from '../interfaces';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data) => {
        // Serialize data to respect @Exclude() decorators
        const serializedData = classToPlain(data);

        // Extract message if it exists in the response data
        let message = 'Success';
        let responseData: any = serializedData;

        // If the controller returns an object with ONLY a 'message' field, use it as the message
        // Otherwise, treat the entire object as data (including entities with message properties)
        if (serializedData && typeof serializedData === 'object' && 'message' in serializedData && Object.keys(serializedData).length === 1) {
          message = serializedData.message;
          responseData = null;
        } else if (serializedData && typeof serializedData === 'object' && 'message' in serializedData && !('id' in serializedData)) {
          // If it has message but no id (not an entity), extract the message
          message = serializedData.message;
          const { message: _, ...rest } = serializedData;
          responseData = Object.keys(rest).length > 0 ? rest : null;
        }

        return {
          statusCode: response.statusCode,
          message,
          data: responseData,
        } as ApiResponse<T>;
      }),
    );
  }
}
