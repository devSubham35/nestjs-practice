import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { AuthenticatedUser } from '../common.types';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  //////////////////////////////////////////////////////////
  /// Generate an access token
  //////////////////////////////////////////////////////////

  async generateToken(payload: AuthenticatedUser) {
    return await this.jwtService.signAsync(payload);
  }

  //////////////////////////////////////////////////////////
  /// Verify an access token
  //////////////////////////////////////////////////////////

  async verifyToken(accessToken: string) {
    return await this.jwtService.verifyAsync<AuthenticatedUser>(accessToken);
  }
}
