import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/common/decorator/public.decorator';
import { UserId } from 'src/common/decorator/common.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("/sign-up")
  async signup(@Body() signUpDto: SignUpDto) {
    return await this.authService.signup(signUpDto);
  }
  
  @Public()
  @Post("/sign-in")
  async signin(@Body() signinDto: SignInDto) {
    return await this.authService.signin(signinDto);
  }

  @Get("/profile")
  async profile(@UserId() userId: string){
    return await this.authService.profile(userId)
  }
}
