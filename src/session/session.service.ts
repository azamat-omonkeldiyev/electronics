import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.session.findMany({
        include: {
          user: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findMe(userId: string) {
    try {
      return await this.prisma.session.findMany({
        where: { userId },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Sessiyani o‘chirish
  async remove(id: string) {
    try {
      return await this.prisma.session.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
