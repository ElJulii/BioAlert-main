import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService],
})
export class CommentsModule {}
