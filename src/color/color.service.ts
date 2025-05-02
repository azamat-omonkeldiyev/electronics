import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ColorService {
  constructor(private readonly prisma:PrismaService){}
  async create(data: CreateColorDto) {
    try {
      let newColor = await this.prisma.color.create({data})
      return newColor;
    } catch (error) {
      throw new BadGatewayException(error.message)
    }
  }

  async findAll(colorName?: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
  
      const colors = await this.prisma.color.findMany({
        where: colorName ? { colorName: { contains: colorName, mode: 'insensitive' } } : undefined,
        skip,
        take: limit,
        orderBy: {
          colorName: 'asc',
        },
      });
  
      const total = await this.prisma.color.count({
        where: colorName ? { colorName: { contains: colorName, mode: 'insensitive' } } : undefined,
      });
  
      return {
        data: colors,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadGatewayException(error.message)
    }
  }

  async findOne(id: string) {
    try {
      let color = await this.prisma.color.findFirst({where:{id}})
      if(!color){
        throw new NotFoundException("color not found")
      }
      return color
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: string, data: UpdateColorDto) {
    try {
      let color = await this.prisma.color.update({where:{id},data})
      if(!color){
        throw new NotFoundException("color not found")
      }
      return color
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      let color = await this.prisma.color.delete({where:{id}})
      return color
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
