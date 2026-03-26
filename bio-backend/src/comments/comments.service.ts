import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) {}

    async create(newId: string, userId: number, content: string) {
        return await this.prisma.newsComment.create({
            data: {
                userId,
                newsId: newId,
                content,
            }, include: {
                user: {
                    select: {
                        username: true,
                        id: true,
                    }
                }
            },
        });
    }

    async findByNewsId(newsId: string) {
        return await this.prisma.newsComment.findMany({
            where: {
                newsId,
            },
            include: {
                user: {
                    select: {
                        username: true,
                        id: true,
                    }
                }
            }, 
            orderBy: {
                date: 'desc',
            }
        });
    }

    async delete(id: string, userId: number) {
        return await this.prisma.newsComment.delete({
            where: {
                id,
                userId
            }
        });
    }
}
