import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async findById(newId: string) {
    return await this.prisma.newsLikes.findMany({
      where: {
        newsId: newId,
      },
    });
  }

  async toggle(newsId: string, userId: number) {
    const existing = await this.prisma.newsLikes.findFirst({
      where: {
        newsId,
        userId,
      },
    });

    if (existing) {
      await this.prisma.newsLikes.delete({
        where: { id: existing.id },
      });
      return { liked: false };
    }
    
    await this.prisma.newsLikes.create({
      data: {
        userId,
        newsId,
      },
    });
    return { liked: true };
  }
}
