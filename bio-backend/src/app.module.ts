import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RegisterModule } from './register/register.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ReportsModule } from './reports/reports.module';
import { UpdatesModule } from './updates/updates.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PublicationsModule } from './publications/publications.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
    RegisterModule, 
    AuthModule, 
    ProfileModule, 
    CloudinaryModule, 
    ReportsModule, 
    UpdatesModule,
    NotificationsModule,
    PublicationsModule,
    LikesModule
  ],
  providers: [PrismaService],
})
export class AppModule {}
