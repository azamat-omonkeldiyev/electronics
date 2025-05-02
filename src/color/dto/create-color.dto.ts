import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateColorDto {
    @ApiProperty({example: "Moviy"})
    @IsString()
    @MinLength(2)
    colorName: string
}
