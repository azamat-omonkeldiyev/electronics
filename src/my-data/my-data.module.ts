import { Module } from '@nestjs/common';
import { MyDataController } from './my-data.controller';
import { CommentService } from 'src/comment/comment.service';
import { LikeModule } from 'src/like/like.module';
import { CommentModule } from 'src/comment/comment.module';
import { LikeService } from 'src/like/like.service';
import { OrderService } from 'src/order/order.service';
import { ProductService } from 'src/product/product.service';
import { ChatService } from 'src/chat/chat.service';

@Module({
  imports:[CommentModule],
  controllers: [MyDataController],
  providers: [LikeService, OrderService, ProductService, ChatService],
})
export class MyDataModule {}
