import { Controller, Get, Req, Post, Param, Delete, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post("toggle/:id")
  create(@Req() req, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.likesService.toggle(id, userId);
  }

  @Get("get/:id")
  findAll(@Param('id') id: string) {
    return this.likesService.findById(id);
  }

}
