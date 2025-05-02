import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {Request} from "express"
import { TypeEnum } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateProductDto,req: Request) {
    try {
      let userId = req['user-id']
      const newProduct = await this.prisma.product.create({
        data: {
          name: data.name,
          price: data.price,
          count: data.count,
          type: data.type,
          description: data.description,
          discount: data.discount,
          image: data.image,
          user: {
            connect: { id: userId },
          },
          category: {
            connect: { id: data.categoryId },
          },
          colors: {
            connect: data.colorIds.map((id) => ({ id })),
          },
        },
        include: {
          category: true,
          colors: true,
          user: true,
        },
      });
      return newProduct
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error.message)
    }
  }

  // Get all products with filters, sorting and pagination
  async getAll(
    page = 1,
    limit = 10,
    sortBy: string = 'createdAt',
    order: 'asc' | 'desc' = 'asc',
    search?: string,
    maxPrice?: number,
    minPrice?: number,
    type?: TypeEnum,
    categoryId?: string,
  ) {
    try {

      const skip = (page - 1) * limit;

      const where: any = {};

      if (search) {
        where.name = { contains: search, mode: 'insensitive' };
      }

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = minPrice;
        if (maxPrice) where.price.lte = maxPrice;
      }

      if (type) {
        where.type = type;
      }

      if (categoryId) {
        where.categoryId = categoryId;
      }

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          include: {
            category: true,
            user: true,
          },
          skip,
          take: limit,
          orderBy: {
            [sortBy]: order,
          },
        }),
        this.prisma.product.count({ where }),
      ]);

      return {
        data: products,
        page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Get one product by id with stats
  async getOne(id: string,req?: Request) {
    try {
      if(req){
        if(req['user-id']){
          let view = await this.prisma.view.findFirst({where:{userId:req['user-id'], productId:id}})
          if(!view){
            let newView = await this.prisma.view.create({data:{userId:req['user-id'],productId:id}})
            console.log({newView})
          }
        }
      }
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          user: true,
          Like: true,
          Comment: true,
        },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const totalViews = await this.prisma.view.findMany({where:{productId:id}})
      const totalLikes = product.Like.length;
      const totalComments = product.Comment.length;

      const averageStar =
        product.Comment.length > 0
          ? product.Comment.reduce((sum, c) => sum + (c.star || 0), 0) / product.Comment.length
          : 0;

      return {
        ...product,
        stats: {
          views: totalViews.length,
          likes: totalLikes,
          comments: totalComments,
          averageStar: parseFloat(averageStar.toFixed(1)),
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUserProducts(userId:string){
    try {
      let products = await this.prisma.product.findMany({where:{userId}})
      if(!products){
        throw new NotFoundException("user products not yet!")
      }
      return products
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: string, data: UpdateProductDto) {
    try {
      let product = await this.prisma.product.update({where:{id},data})
      if(!product){
        throw new NotFoundException("product not found")
      }
      return product
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string) {
    try {
      await  this.getOne(id)
      let product = await this.prisma.product.delete({where:{id}})
      return product
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
