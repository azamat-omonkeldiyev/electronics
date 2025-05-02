import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';
import { Roles } from 'src/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/guard/role.guard';
import { AuthGuard } from 'src/guard/auth.guard';
import { ApiQuery } from '@nestjs/swagger';


enum sortEnum {
  id = 'id',
  createdAt = "CreatedAt"
}
enum orderEnum {
  asc = 'asc',
  desc = 'desc',
}

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(UserRole.ADMIN,UserRole.USER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto,@Req() req:Request) {
    return this.orderService.create(createOrderDto,req);
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
    name: 'productId',
    required: false,
  })
  @ApiQuery({
    name: 'userId',
    required: false,
  })
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: sortEnum,
    @Query('order') order: orderEnum,
    @Query('productId') productId: string,
    @Query('userId') userId:string
  ) {
    return this.orderService.findAll(Number(page),Number(limit),sortBy,order,userId,productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
