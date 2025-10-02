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
        const serializedData = classToPlain(data);

        let message = 'Success';
        let responseData: any = serializedData;

        if (serializedData && typeof serializedData === 'object' && 'message' in serializedData && Object.keys(serializedData).length === 1) {
          message = serializedData.message;
          responseData = null;
        } else if (serializedData && typeof serializedData === 'object' && 'message' in serializedData && !('id' in serializedData)) {
          message = serializedData.message;
          const { message: _, ...rest } = serializedData;
          responseData = Object.keys(rest).length > 0 ? rest : null;
        }

        const responseObject: any = {
          statusCode: response.statusCode,
          message,
        };

        if (responseData !== null) {
          responseObject.data = responseData;
        }

        return responseObject as ApiResponse<T>;
      }),
    );
  }
}
