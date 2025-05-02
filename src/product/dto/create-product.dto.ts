import { ApiProperty } from '@nestjs/swagger';
import { TypeEnum } from '@prisma/client';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  Max,
  IsArray,
  IsEnum,
  IsNotEmpty,
  MAX_LENGTH,
  MaxLength,
  MinLength,
  min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({example:"MacBook"})
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  name: string;

  @ApiProperty({example:1})
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({example:"be7404ad-21c4-4573-a96a-f02e279fa955"})
  @IsUUID()
  categoryId: string;

  @ApiProperty({example:12})
  @IsNumber()
  @Min(1)
  @Max(999999)
  count: number;

  @ApiProperty({ enum: TypeEnum })
  @IsEnum(TypeEnum)
  type: TypeEnum;

  @ApiProperty({example:['bdff7d3c-0164-4874-9ddc-f877da0b4533','e8a1046d-235a-46da-a1f7-2fd95e3e71b8']})
  @IsArray()
  @IsNotEmpty()
  colorIds: string[];

  @ApiProperty({example: "Ishlatilmagan chang bosib turgan faqat"})
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({example:"//hhts-macbook.photo.png"})
  @IsString()
  @MaxLength(100)
  @MinLength(10)
  image:string

  @ApiProperty({example: 99})
  @IsNumber()
  @Min(1)
  @Max(1000)
  discount: number;
}
