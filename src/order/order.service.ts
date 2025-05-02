import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService){}
  async create(data: CreateOrderDto,req: Request) {
    try {
      let userId = req['user-id']
      let newOrder = await this.prisma.order.create({data:{...data,userId}})
      return newOrder
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    sortBy: string = 'createdAt',
    order: 'asc' | 'desc' = 'asc',
    userId?: string,
    productId?:string
  ) {
    try {
      const skip = (page - 1) * limit

      const where: any = {};

      if (userId) {
        where.userId = userId;
      }

      if(productId){
        where.productId = productId;
      }
      const [orders, total] = await Promise.all([
        this.prisma.order.findMany({
          where,
          include: {
            product: true,
            user: true,
          },
          skip,
          take: limit,
          orderBy: {
            [sortBy]: order,
          },
        }),
        this.prisma.order.count({ where }),
      ]);

        return {
          data: orders,
          page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        };

    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: string) {
    try {
      let order = await this.prisma.order.findFirst({where:{id},include: {
        product: true,
        user: true,
      },})
      if(!order){
        throw new NotFoundException("order not found")
      }
      return order
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findUserOrder(userId:string) {
    try {
      let orders = await this.prisma.order.findMany({where:{userId},include: {
        product: true,
        user: true,
      },})
      if(!orders){
        throw new NotFoundException("User order not yet!")
      }
      return orders
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: string, data: UpdateOrderDto) {
    try {
      let order = await this.prisma.order.update({where:{id},data})
      if(!order){
        throw new NotFoundException("User order not yet!")
      }
      return order
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      let order = await this.prisma.order.delete({where:{id}})
      return order
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
