import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PrismaService } from '../prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    CloudinaryModule,
    AuthModule
  ],
  controllers: [PublicationsController],
  providers: [PublicationsService, PrismaService, CloudinaryService],
})
export class PublicationsModule {}
