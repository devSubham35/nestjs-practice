import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {

  constructor(private readonly jwtService: JwtService) { }

  async generateToken(payload: { sub: string, email: string }) {
    return await this.jwtService.signAsync(payload)
  }

  async verifyToken(accessToken: string) {
    return await this.jwtService.verify(accessToken)
  }

}
