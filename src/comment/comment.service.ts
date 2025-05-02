import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class CommentService {
  constructor(private readonly prisma:PrismaService,){}
  async create(createCommentDto: CreateCommentDto,req: Request) {
    try {
      let userId = req['user-id']
      let newComment = await this.prisma.comment.create({data:{...createCommentDto,userId}})
      return newComment
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    userId?: string,
    productId?: string
  ) {
    try {
      const skip = (page - 1) * limit;

      const where: any = {};

      if (productId) {
        where.productId = productId;
      }
      if (userId) {
        where.userId = userId;
      }

      const [comments, total] = await Promise.all([
        this.prisma.comment.findMany({
          where,
          include: {
            product: true,
            user: true,
          },
          skip,
          take: limit,
        }),
        this.prisma.comment.count({ where }),
      ]);

      return {
        data: comments,
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
      let comment = await this.prisma.comment.findFirst({where:{id},include:{user:true,product:true}})
      if(!comment){
        throw new NotFoundException("comment not found")
      }
      return comment
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findUserComment(userId: string) {
    try {
      let comment = await this.prisma.comment.findMany({where:{userId},include:{user:true,product:true}})
      if(!comment){
        throw new NotFoundException("comment not found")
      }
      return comment
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: string, data: UpdateCommentDto) {
    try {
      let comment = await this.prisma.comment.update({where:{id},data})
      if(!comment){
        throw new NotFoundException("comment not found")
      }
      return comment
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      let comment = await this.prisma.comment.delete({where:{id}})
      return comment
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
