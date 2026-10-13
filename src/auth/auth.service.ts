import bcrypt from "bcrypt"
import { UserService } from 'src/user/user.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { UserDocument } from "src/user/schemas/userSchema";
import { AuthenticatedUser } from "src/common/common.types";
import { TokenService } from './../common/services/token.service';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';


@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) { }

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

    const isExistingUser = await this.userService.findByEmail(signupDto.email)

    if (isExistingUser) {
      throw new ConflictException("User already exist")
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10)

    const user = await this.userService.create({
      ...signupDto,
      password: hashedPassword
    })


    const accessToken = await this.tokenService.generateToken(
      this.toTokenPayload(user)
    )

    return {
      data: { user, accessToken },
      message: "Signup Successfully"
    }
  }

  /// Signin Service
  async signin(signinDto: SignInDto) {

    const existingUser = await this.userService.findByEmail(signinDto.email)

    if (!existingUser) {
      throw new BadRequestException("User not found")
    }

    const isPasswordMatched = await bcrypt.compare(signinDto.password, existingUser.password)

    if (!isPasswordMatched) {
      throw new BadRequestException("Invalid credentials")
    }

    const { password, ...userResponse } = existingUser.toObject();

    const accessToken = await this.tokenService.generateToken(
      this.toTokenPayload(existingUser)
    )

    return {
      data: { user: userResponse, accessToken },
      message: "Signup Successfully"
    }

  }

  /// User profile service
  async profile(id: string) {
    const user = await this.userService.findById(id)

    if (!user) {
      throw new BadRequestException("User not found")
    }
    const { password, ...passwordLessUser } = user

    return {
      data: passwordLessUser,
      message: "Profile fetched succesfully"
    }
  }
}
