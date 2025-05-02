import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessagetDto } from './dto/create-message.chat';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { Request } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createChatDto: CreateChatDto,@Req() req: Request) {
    return this.chatService.createChat(req,createChatDto);
  }

  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() request: Request) {
    let id = request['user-id']
    // console.log(id)
    return this.chatService.getChat(id);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get('allchat')
  findAllChat() {
    return this.chatService.getAllChats();
  }

  
  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @UseGuards(AuthGuard)
  @Delete(":id")
  remove(@Param('id') id:string){
    return this.chatService.deleteChat(id)
  }

  
  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post('message')
  createMessage(@Body() data: CreateMessagetDto,@Req() req: Request){
    return this.chatService.createMessage(req,data)
  }

  
  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get('message/:chatid')
  getAllMessage(@Param('chatid') chatid:string){
    return this.chatService.getMessages(chatid)
  }
}
