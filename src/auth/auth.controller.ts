import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/common/decorator/public.decorator';
import { UserId } from 'src/common/decorator/common.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  errorResponse,
  successResponse,
  USER_EXAMPLE,
} from 'src/common/swagger/swagger.examples';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/sign-up')
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiCreatedResponse({
    description: 'The account was created successfully.',
    example: successResponse(201, 'Signup Successfully', {
      user: USER_EXAMPLE,
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.signature',
    }),
  })
  @ApiBadRequestResponse({
    description: 'The request body failed validation.',
    example: errorResponse(400, ['email must be an email']),
  })
  @ApiConflictResponse({
    description: 'An account with this email already exists.',
    example: errorResponse(409, 'User already exist'),
  })
  async signup(@Body() signUpDto: SignUpDto) {
    return await this.authService.signup(signUpDto);
  }

  @Public()
  @Post('/sign-in')
  @ApiOperation({ summary: 'Sign in and receive an access token' })
  @ApiCreatedResponse({
    description: 'Authentication succeeded.',
    example: successResponse(201, 'Signup Successfully', {
      user: USER_EXAMPLE,
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.signature',
    }),
  })
  @ApiBadRequestResponse({
    description: 'The credentials are invalid or the user does not exist.',
    example: errorResponse(400, 'Invalid credentials'),
  })
  async signin(@Body() signinDto: SignInDto) {
    return await this.authService.signin(signinDto);
  }

  @Get('/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiOkResponse({
    description: 'The current user profile.',
    example: successResponse(200, 'Profile fetched succesfully', USER_EXAMPLE),
  })
  @ApiUnauthorizedResponse({
    description: 'A valid bearer token was not supplied.',
    example: errorResponse(401, 'Unauthorized'),
  })
  async profile(@UserId() userId: string) {
    return await this.authService.profile(userId);
  }
}
