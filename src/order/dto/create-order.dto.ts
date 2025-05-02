import { ApiProperty } from "@nestjs/swagger"
import { IsUUID, Min, MinLength } from "class-validator"

export class CreateOrderDto {
    @ApiProperty({example:"UUID"})
    @IsUUID()
    productId:string
    @ApiProperty({example:"Qizil"})
    @MinLength(2)
    color: string
    @ApiProperty({example: 1})
    @Min(1)
    count: number
}
