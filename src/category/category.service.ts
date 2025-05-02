import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma:PrismaService){}
  async create(data: CreateCategoryDto) {
    try {
      let newCategory = await this.prisma.category.create({data})
      return newCategory;
    } catch (error) {
      throw new BadGatewayException(error.message)
    }
  }

  async findAll(name?: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
  
      const categories = await this.prisma.category.findMany({
        where: name ? { name: { contains: name, mode: 'insensitive' } } : undefined,
        skip,
        take: limit,
        orderBy: {
          name: 'asc',
        },
      });
  
      const total = await this.prisma.category.count({
        where: name ? { name: { contains: name, mode: 'insensitive' } } : undefined,
      });
  
      return {
        data: categories,
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
      let Category = await this.prisma.category.findFirst({where:{id}})
      if(!Category){
        throw new NotFoundException("Category not found")
      }
      return Category
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: string, data: UpdateCategoryDto) {
    try {
      let Category = await this.prisma.category.update({where:{id},data})
      if(!Category){
        throw new NotFoundException("Category not found")
      }
      return Category
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      let Category = await this.prisma.category.delete({where:{id}})
      return Category
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
