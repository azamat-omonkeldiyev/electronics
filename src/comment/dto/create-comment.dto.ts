import { ApiBadRequestResponse, ApiProperty } from "@nestjs/swagger"
import { IsUUID, Max, Min, MinLength } from "class-validator"

export class CreateCommentDto {
    @ApiProperty({example:'UUID'})
    @IsUUID()
    productId: string

    @ApiProperty({example:'3'})
    @Min(1)
    @Max(5)
    star: number

    @ApiProperty({example:"Good and usefull"})
    @MinLength(1)
    message: string
}
