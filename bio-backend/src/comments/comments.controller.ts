import { Controller, Post, UseGuards , Req, Param, Body, Get, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post("create/:id")
  create(@Req() req, @Param('id') newsId: string, @Body() body) {
    const userId = req.user.sub;
    return this.commentsService.create(newsId, userId, body.content);
  }

  @Get("get/:id")
  findByNews(@Param('id') newsId: string) {
    return this.commentsService.findByNewsId(newsId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("delete/:id")
  delete(@Req() req, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.commentsService.delete(id, userId);
  }
}
