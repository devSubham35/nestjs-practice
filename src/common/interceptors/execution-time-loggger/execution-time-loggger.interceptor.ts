import { Observable, tap } from 'rxjs';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class ExecutionTimeLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const startTime = Date.now()
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

   return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          console.log(
            `[REQUEST] ${request.method} ${request.url} ${response.statusCode} ${duration}ms`,
          );
        },
        error: () => {
          const duration = Date.now() - startTime;
          console.log(
            `[REQUEST FAILED] ${request.method} ${request.url} ${duration}ms`,
          );
        },
      }),
    );
  }
}
