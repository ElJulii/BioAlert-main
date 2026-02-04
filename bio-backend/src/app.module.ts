import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RegisterModule } from './register/register.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [RegisterModule, AuthModule, ProfileModule, CloudinaryModule, ReportsModule],
  providers: [PrismaService],
})
export class AppModule {}
