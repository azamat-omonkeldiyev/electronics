import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Search, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';
import { TypeEnum, UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/user/decorators/role.decorator';
import { ViewGuard } from 'src/guard/view.guard';

enum sortEnum {
  id = 'id',
  name = 'firstName',
  price = 'price',
  count = 'count',
  createdAt = "CreatedAt"
}
enum orderEnum {
  asc = 'asc',
  desc = 'desc',
}

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(UserRole.ADMIN,UserRole.USER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto,@Req() req: Request) {
    return this.productService.create(createProductDto,req);
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
    name: 'Type',
    enum: TypeEnum,
    required: false,
  })
  @ApiQuery({
    name: 'search',
    required: false,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
  })
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: sortEnum,
    @Query('order') order: orderEnum,
    @Query('Type') type: TypeEnum,
    @Query('search') search: string,
    @Query('maxPrice') maxPrice: number,
    @Query('minPrice') minPrice: number,
    @Query('categoryId') categoryId: string 
  ) {
    return this.productService.getAll(Number(page),Number(limit),sortBy,order,search,maxPrice,minPrice,type,categoryId)
  }

  @UseGuards(ViewGuard)
  @Get(':id')
  findOne(@Param('id') id: string,@Req() req:Request) {
    return this.productService.getOne(id,req);
  }

  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Roles(UserRole.ADMIN,UserRole.USER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
