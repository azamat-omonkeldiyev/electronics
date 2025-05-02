import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ChatService } from 'src/chat/chat.service';
import { CommentService } from 'src/comment/comment.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { LikeService } from 'src/like/like.service';
import { OrderService } from 'src/order/order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';

UseGuards(AuthGuard);
@Controller('my-data')
export class MyDataController {
  constructor(
    private readonly comment: CommentService,
    private readonly like: LikeService,
    private readonly order: OrderService,
    private readonly product: ProductService,
    private readonly chat: ChatService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('myChats')
  async getAllChats(@Req() req: Request) {
    let userId = req['user-id'];
    return this.chat.getChat(userId);
  }

  @UseGuards(AuthGuard)
  @Get('myOrders')
  async getAllOrder(@Req() req: Request) {
    let userId = req['user-id'];
    return this.order.findUserOrder(userId);
  }

  @UseGuards(AuthGuard)
  @Get('myFavorite')
  async getAllLikes(@Req() req: Request) {
    let userId = req['user-id'];
    return this.like.findUserLikes(userId);
  }

  @UseGuards(AuthGuard)
  @Get('myComments')
  async getComments(@Req() req: Request) {
    let userId = req['user-id'];
    return this.comment.findUserComment(userId);
  }

  @UseGuards(AuthGuard)
  @Get('myPRODUCTS')
  async getProducts(@Req() req: Request) {
    let userId = req['user-id'];
    return this.product.getUserProducts(userId);
  }
}
