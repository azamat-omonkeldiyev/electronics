import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateLikeDto {
    @ApiProperty({example:'054a5221-b521-47c4-a17c-f7874d138280'})
    @IsUUID()
    product: string;
}
