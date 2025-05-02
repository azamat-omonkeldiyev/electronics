import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { RegionModule } from './region/region.module';
import { ProductModule } from './product/product.module';
import { SessionModule } from './session/session.module';
import { ColorModule } from './color/color.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterController } from './multer/multer.controller';
import { CategoryModule } from './category/category.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { OrderModule } from './order/order.module';
import { ChatModule } from './chat/chat.module';
import { MyDataModule } from './my-data/my-data.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UserModule, PrismaModule, MailModule, RegionModule, ProductModule, SessionModule, ColorModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/file',
    }),
    CategoryModule,
    LikeModule,
    CommentModule,
    OrderModule,
    ChatModule,
    MyDataModule,
    AdminModule
  ],
  controllers: [AppController,MulterController],
  providers: [AppService],
})
export class AppModule {}
