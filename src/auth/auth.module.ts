import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/utils/config';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { TokenService } from 'src/common/services/token.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: config.JWT_SECRET,
      signOptions: { expiresIn: "1d" },
    })
  ],
  exports: [TokenService],
  providers: [AuthService, TokenService],
  controllers: [AuthController],
})
export class AuthModule {}
