import { ApiProperty } from "@nestjs/swagger"
import { TypeEnum } from "@prisma/client"
import { IsEnum, IsString, MinLength } from "class-validator"

export class CreateCategoryDto {
    @ApiProperty({example:'Samsung'})
    @IsString()
    @MinLength(3)
    name:string
    @ApiProperty({enum:TypeEnum})
    @IsEnum(TypeEnum)
    type: TypeEnum
}
