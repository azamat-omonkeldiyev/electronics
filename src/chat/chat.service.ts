import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessagetDto } from './dto/create-message.chat';
import { Request } from 'express';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createChat(@Req() req: Request, data: CreateChatDto) {
    try {
      const fromId = req['user-id'];
      if (!fromId) throw new BadRequestException('User ID not found in request');
      let chatOld = await this.prisma.chat.findFirst({where:{fromId,toId: data.toId}})

      if(chatOld){
        throw new BadRequestException("Chat already created!")
      }

      const chat = await this.prisma.chat.create({
        data: {
          ...data,
          fromId,
        },
      });
      return chat;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getChat(myId: string) {
    try {
      const chat = await this.prisma.chat.findMany({
        where: {
          OR: [{ fromId: myId }, { toId: myId }],
        },
        include: {
          from: true,
          to: true,
        },
      });
      return chat;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllChats() {
    try {
      const chats = await this.prisma.chat.findMany({
        include: {
          from: true,
          to: true,
        },
      });
      return chats;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteChat(id: string) {
    try {
      const chat = await this.prisma.chat.delete({ where: { id } });
      return chat;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createMessage(@Req() req: Request, data: CreateMessagetDto) {
    try {
      const fromId = req['user-id'];
      if (!fromId) throw new BadRequestException('User ID not found in request');

      const newMessage = await this.prisma.chatMessage.create({
        data: {
          ...data,
          fromId,
        },
      });
      return newMessage;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getMessages(chatId: string) {
    try {
      const messages = await this.prisma.chatMessage.findMany({
        where: { chatId },
      });
      return messages;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
