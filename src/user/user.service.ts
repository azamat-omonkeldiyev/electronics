import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { sendOtpEmailDto } from './dto/sendOtpEmail.dto';
import { MailService } from 'src/mail/mail.service';
import { verifyOtpDto } from './dto/verify-otp.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refreshtoken.dto';
import { Request } from 'express';
import { CreateAdminrDto } from './dto/createAdmin.dto';
import * as bcrypt from 'bcrypt'


@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly jwt: JwtService,
  ) {}

  generateAccessToken(payload: { id: string; role: string }): string {
    return this.jwt.sign(payload, {
      expiresIn: '15m',
    });
  }

  generateRefreshToken(payload: { id: string; role: string }): string {
    return this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }

  async findEmail(email: string) {
    try {
      return await this.prisma.user.findFirst({ where: { email } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async sentOtpEmail(data: sendOtpEmailDto) {
    try {
      let userEmail = await this.findEmail(data.email);
      if (userEmail) throw new BadRequestException('Email already exists!');
      const otp = this.mail.createOtp(data.email);
      const message = await this.mail.sendEmail(
        data.email,
        'ONE-TIME PASSWORD',
        `<h4>Your login password is <h3><u>${otp}</u></h3>. It is valid for 2 minutes.</h4>`,
      );
      return { message };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  verifyOtp(data: verifyOtpDto) {
    try {
      const match = this.mail.checkOtp(data.otp, data.email);
      return { result: match };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  verifyRefreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const data = this.jwt.verify(refreshTokenDto.token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      let payload = { id: data.id, role: data.role };
      let accessToken = this.generateAccessToken(payload);
      return { accessToken };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async register(data: CreateUserDto) {
    try {
      let userEmail = await this.findEmail(data.email);
      if (userEmail) throw new BadRequestException('Email already exists');

      let hash = bcrypt.hashSync(data.password,10)

      const newUser = await this.prisma.user.create({
        data: {
          ...data,
          password: hash,
          status: 'PENDING',
          role: 'USER',
        },
      });
      return newUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(data: LoginUserDto, req: Request) {
    try {
      if (
        data.email == process.env.ADMIN_EMAIL &&
        data.password == process.env.ADMIN_PASSWORD
      ) {
        const payload = { id: "54407c0f-1ddc-4cc1-b705-25845bd6b4cf", role: "ADMIN" };
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload);
  
        return { accessToken, refreshToken };
      }
      let user = await this.findEmail(data.email);
      if (!user) throw new NotFoundException('Email does not exist');

      let isMatch = bcrypt.compareSync(data.password,user.password)
      if(!isMatch){
        throw new BadRequestException('Wrong credentials')
      }
      const ip_address = req.ip || req.connection.remoteAddress || '';
      const device_data = req.headers['user-agent'] || 'unknown';

      // Mavjud sessionni tekshirish
      const existingSession = await this.prisma.session.findFirst({
        where: {
          userId: user.id,
          ip_address,
        },
      });

      // Session mavjud bo‘lmasa — yangi yaratish
      if (!existingSession) {
        await this.prisma.session.create({
          data: {
            userId: user.id,
            ip_address,
            device_data,
          },
        });
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { status: 'ACTIVE' },
      });

      const payload = { id: user.id, role: user.role };
      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async me(id: string) {
    try {
      return await this.prisma.user.findFirst({
        where: { id },
        include: { region: true },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    sortBy: string = 'createdAt',
    order: 'asc' | 'desc' = 'asc',
    firstName?: string,
    lastName?: string,
    regionId?: string,
    year?: number,
    email?: string,
  ) {
    try {
      const where: any = {};
      if (firstName)
        where.firstName = { contains: firstName, mode: 'insensitive' };
      if (lastName)
        where.lastName = { contains: lastName, mode: 'insensitive' };
      if (regionId) where.regionId = regionId;
      if (year) where.year = year;
      if (email) where.email = { contains: email, mode: 'insensitive' };

      const total = await this.prisma.user.count({ where });
      const users = await this.prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where,
        orderBy: { [sortBy]: order },
        include: { region: true },
      });

      return {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        users,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      let user = await this.prisma.user.findFirst({
        where: { id },
        include: { region: true },
      });
      if (!user) {
        throw new BadRequestException('user not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, data: UpdateUserDto) {
    try {
      let user = await this.prisma.user.update({ where: { id }, data });
      if (!user) {
        throw new BadRequestException('user not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      let user = await this.prisma.user.delete({ where: { id } });
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  async createAdmin(data: CreateAdminrDto) {
    try {
      const exists = await this.findEmail(data.email)
      if (exists) throw new BadRequestException('Email already exists')
  
      let hash = bcrypt.hashSync(data.password,10)
      const admin = await this.prisma.user.create({
        data: {
          firstName: data.firstName,
          email: data.email,
          password: hash,
          role: data.role,
          status: 'ACTIVE',
        },
      })
  
      return admin
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
  
  async deleteAdmin(id: string) {
    try {
      const user = await this.findOne(id)
      if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
        throw new BadRequestException('User is not an admin')
      }
  
      return await this.prisma.user.delete({ where: { id } })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
