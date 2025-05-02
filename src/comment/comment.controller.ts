import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/guard/role.guard';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    return this.commentService.create(createCommentDto,req);
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
    @Query('productId') productId: string,
    @Query('userId') userId: string,
  ) {
    return this.commentService.findAll(Number(page),Number(limit),userId,productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Roles(UserRole.ADMIN,UserRole.USER,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
