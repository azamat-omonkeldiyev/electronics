import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class sendOtpEmailDto {
    @IsEmail()
    @ApiProperty({ example: 'ahmadjon@gmail.com' })
    email: string;
}
