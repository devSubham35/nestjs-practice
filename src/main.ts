import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true
  }));

  ///////////////////////////////
  /// Swagger Configuartion
  ///////////////////////////////
  
  const swaggerConfig = new DocumentBuilder()
  .setTitle('TaskFlow API')
  .setDescription('API documentation for the TaskFlow application')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  
  SwaggerModule.setup('docs', app, documentFactory, {
    useGlobalPrefix: true,
  });
  
  ///////////////////////////////
  ///////////////////////////////

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
