import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { retry } from 'rxjs';

@Injectable()
export class LikeService {
  constructor(private readonly prisma:PrismaService){}
  async create(data: CreateLikeDto, req: Request) {
    try {
      let userId = req['user-id']
      if(!userId){
        throw new BadRequestException("user not found")
      }
      let oldLIke = await this.prisma.like.findFirst({where:{userId,productId:data.product}})
      if(oldLIke){
        throw new BadRequestException("Like already exists this product")
      }
      let newLike = await this.prisma.like.create({data: {productId:data.product, userId}}) 
      return newLike
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findUserLikes(userId: string) {
    try {
      let likes = await this.prisma.like.findMany({where:{userId},include:{product:true}})
      return likes
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string) {
    try {
      let like = await this.prisma.like.findFirst({where:{id}})
      if(!like){
        throw new NotFoundException('like not found')
      }
      let likedeleted = await this.prisma.like.delete({where:{id}})
      return likedeleted
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
