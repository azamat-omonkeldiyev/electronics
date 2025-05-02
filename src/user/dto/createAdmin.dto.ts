import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"
import {  IsEmail, IsEnum, IsString, IsUUID, Max, MaxLength, Min, MinLength } from "class-validator"

export class CreateAdminrDto {
    @ApiProperty({example: "Bobur"})
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    firstName:string

    @ApiProperty({example:"adminjon@gmail.com"})
    @IsEmail()
    email: string
    
    @ApiProperty({example:"strongPass5462"})
    @IsString()
    @MaxLength(16)
    @MinLength(8)
    password: string

    @ApiProperty({enum:UserRole,example:UserRole.ADMIN})
    @IsEnum(UserRole)
    role: UserRole
}
