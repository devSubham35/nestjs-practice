import bcrypt from "bcrypt"
import { UserService } from 'src/user/user.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { TokenService } from './../common/services/token.service';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';


@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) { }

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

    const payload = { sub: user._id, email: user.email }
    const accessToken = await this.tokenService.generateToken(payload)

    return {
      data: { user, accessToken },
      message: "Signup Successfully"
    }
  }


  async signin(signinDto: SignInDto) {

    const existingUser = await this.userService.findByEmail(signinDto.email)

    if (!existingUser) {
      throw new BadRequestException("User not found")
    }

    const isPasswordMatched = await bcrypt.compare(signinDto.password, existingUser.password)

    if (!isPasswordMatched) {
      throw new BadRequestException("Invalid credentials")
    }

    const { password, ...user } = existingUser

    const payload = { sub: String(existingUser._id), email: existingUser.email }
    const accessToken = await this.tokenService.generateToken(payload)

    return {
      data: { user, accessToken },
      message: "Signup Successfully"
    }

  }

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
