import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";

export class CreateRegionDto {
    @ApiProperty({example: "Jizzax"})
    @MinLength(3)
    @MaxLength(30)
    name: string
}
