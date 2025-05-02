import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorService.create(createColorDto);
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
    return this.colorService.findAll(name,Number(page),Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colorService.findOne(id);
  }

  
  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    return this.colorService.update(id, updateColorDto);
  }

  
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colorService.remove(id);
  }
}
