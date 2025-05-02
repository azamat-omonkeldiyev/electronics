import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsEmail()
  @ApiProperty({ example: 'ahmadjon@gmail.com' })
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @ApiProperty({ example: 'strongPass5462' })
  password: string;
}
