import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Aarav Sharma',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Unique email address used to sign in',
    example: 'aarav.sharma@example.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'Account password',
    example: 'StrongPassword@123',
    format: 'password',
    writeOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class SignInDto {
  @ApiProperty({
    description: 'Registered email address',
    example: 'aarav.sharma@example.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'Account password',
    example: 'StrongPassword@123',
    format: 'password',
    writeOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
