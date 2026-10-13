import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform/response-transform.interceptor';
// import { ExecutionTimeLoggerInterceptor } from './common/interceptors/execution-time-loggger/execution-time-loggger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1")

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(
    new ResponseTransformInterceptor(),
    // new ExecutionTimeLoggerInterceptor(),
  );

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
