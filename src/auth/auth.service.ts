import bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { UserDocument } from 'src/user/schemas/userSchema';
import { AuthenticatedUser } from 'src/common/common.types';
import { TokenService } from './../common/services/token.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  /// Format user response without password
  private toTokenPayload(user: UserDocument): AuthenticatedUser {
    return {
      sub: user._id.toString(),
      email: user.email,
      roles: user.roles,
      isActive: user.isActive,
      isVerified: user.isVerified,
    };
  }

  /// Signup Service
  async signup(signupDto: SignUpDto) {
    const isExistingUser = await this.userService.findByEmail(signupDto.email);

    if (isExistingUser) {
      throw new ConflictException('User already exist');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const user = await this.userService.create({
      ...signupDto,
      password: hashedPassword,
    });

    const accessToken = await this.tokenService.generateToken(
      this.toTokenPayload(user),
    );
    const userResponse = user.toObject();
    Reflect.deleteProperty(userResponse, 'password');

    return {
      data: { user: userResponse, accessToken },
      message: 'Signup Successfully',
    };
  }

  /// Signin Service
  async signin(signinDto: SignInDto) {
    const existingUser = await this.userService.findByEmail(signinDto.email);

    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    const isPasswordMatched = await bcrypt.compare(
      signinDto.password,
      existingUser.password,
    );

    if (!isPasswordMatched) {
      throw new BadRequestException('Invalid credentials');
    }

    const userResponse = existingUser.toObject();
    Reflect.deleteProperty(userResponse, 'password');

    const accessToken = await this.tokenService.generateToken(
      this.toTokenPayload(existingUser),
    );

    return {
      data: { user: userResponse, accessToken },
      message: 'Signin Successfully',
    };
  }

  /// User profile service
  async profile(id: string) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new BadRequestException('User not found');
    }
    Reflect.deleteProperty(user, 'password');

    return {
      data: user,
      message: 'Profile fetched succesfully',
    };
  }
}
