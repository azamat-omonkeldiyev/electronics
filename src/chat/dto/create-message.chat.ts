import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"

export class CreateMessagetDto {
    @ApiProperty({example:"UUID"})
    toId: string
    @ApiProperty({example:"UUID"})
    chatId: string
    @ApiProperty({example:"Have a nice day, tvar!"})
    @IsString()
    @MinLength(1)
    message: string
}
