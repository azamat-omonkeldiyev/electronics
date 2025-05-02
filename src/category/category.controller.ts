import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/user/decorators/role.decorator';
import { RoleGuard } from 'src/guard/role.guard';
import { AuthGuard } from 'src/guard/auth.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createColorDto: CreateCategoryDto) {
    return this.categoryService.create(createColorDto);
  }

  @ApiQuery({
    example: 1,
    name: 'page',
  })
  @ApiQuery({
    example: 10,
    name: 'limit',
  })
  @ApiQuery({
    name: 'name',
    required: false,
  })
  @Get()
  findAll(
    @Query('page') page: number,
  @Query('limit') limit: number,
  @Query('name') name: string,
  ) {
    return this.categoryService.findAll(name,Number(page),Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  
  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColorDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateColorDto);
  }

  
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
