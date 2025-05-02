import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class CreateChatDto {
    @ApiProperty({example:"UUID"})
    @IsUUID()
    toId: string
    
}
