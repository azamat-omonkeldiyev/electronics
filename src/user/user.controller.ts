import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { sendOtpEmailDto } from './dto/sendOtpEmail.dto';
import { verifyOtpDto } from './dto/verify-otp.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refreshtoken.dto';
import { Roles } from './decorators/role.decorator';
import { RoleGuard } from 'src/guard/role.guard';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';
import {Request} from "express"
import { ApiQuery } from '@nestjs/swagger';

enum sortEnum {
  id = 'id',
  firstName = 'firstName',
  lastName = 'lastName',
  year = 'year',
  email = 'email',
  createdAt = "CreatedAt"
}
enum orderEnum {
  asc = 'asc',
  desc = 'desc',
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  
  @Post('sendPasswordEmail')
  sendOtpEmail(@Body() data:sendOtpEmailDto){
    return this.userService.sentOtpEmail(data)
  }
  
  @Post("verify")
  verifyOtp(@Body() data:verifyOtpDto){
    return this.userService.verifyOtp(data)
  }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post("login")
  login(@Body() data:LoginUserDto, @Req() req: Request){
    return this.userService.login(data,req)
  }

  @Post('refreshtoken')
  refreshToken(@Body() data: RefreshTokenDto){
    return this.userService.verifyRefreshToken(data)
  }


  @Get()
  @ApiQuery({
    example: 1,
    name: 'page',
  })
  @ApiQuery({
    example: 10,
    name: 'limit',
  })
  @ApiQuery({
    name: 'sortBy',
    enum: sortEnum,
  })
  @ApiQuery({
    name: 'order',
    enum: orderEnum,
  })
  @ApiQuery({
    name: 'firstName',
    required: false,
  })
  @ApiQuery({
    name: 'lastName',
    required: false,
  })
  @ApiQuery({
    name: 'year',
    required: false,
  })
  @ApiQuery({
    name: 'region',
    required: false,
  })
  @ApiQuery({
    name: 'email',
    required: false,
  })
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: sortEnum,
    @Query('order') order: orderEnum,
    @Query('firstName') firstName: string,
    @Query('lastName') lastName: string,
    @Query('email') email: string,
    @Query('year') year: number,
    @Query('region') region: string 
  ) {
    return this.userService.findAll(Number(page),Number(limit),sortBy,order,firstName,lastName,region,Number(year),email);
  }

  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN,UserRole.USER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get("/me")
  me(@Req() req:Request) {
    const userId = req['user-id'];
    return this.userService.me(userId);
  }

  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN,UserRole.USER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN,UserRole.USER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(UserRole.ADMIN,UserRole.USER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
