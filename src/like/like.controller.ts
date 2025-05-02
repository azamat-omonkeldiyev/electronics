import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
// import { UpdateLikeDto } from './dto/update-like.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createLikeDto: CreateLikeDto,@Req() req:Request) {
    return this.likeService.create(createLikeDto,req);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likeService.remove(id);
  }
}
