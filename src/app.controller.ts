import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  errorResponse,
  successResponse,
} from './common/swagger/swagger.examples';

@ApiTags('General')
@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Check that the API is running' })
  @ApiOkResponse({
    description: 'The API is available.',
    example: successResponse(200, 'Request successful', 'Hello World!'),
  })
  @ApiUnauthorizedResponse({
    description: 'A valid bearer token was not supplied.',
    example: errorResponse(401, 'Unauthorized'),
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
