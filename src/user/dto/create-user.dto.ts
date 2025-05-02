import { ApiProperty } from "@nestjs/swagger"
import { UserRole, UserStatus } from "@prisma/client"
import { IS_ALPHA, IsEmail, IsEnum, IsString, IsUUID, Max, MaxLength, Min, MinLength, maxLength } from "class-validator"

export class CreateUserDto {
    @ApiProperty({example: "Ahmad"})
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    firstName:string

    @ApiProperty({example: "Muhammadiyev"})
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    lastName:string

    @ApiProperty({example: "9f1b8a20-4b99-4b67-8c67-316bfb6bfe4a"})
    @IsUUID()
    regionId: string

    @ApiProperty({example: 2001})
    @Max(2025)
    @Min(1950)
    year: number

    @ApiProperty({example: "//hhttpsphonto/smcksvjndk.png"})
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    image: string

    @ApiProperty({example:"ahmadjon@gmail.com"})
    @IsEmail()
    email: string
    
    @ApiProperty({example:"strongPass5462"})
    @IsString()
    @MaxLength(16)
    @MinLength(8)
    password: string
}
