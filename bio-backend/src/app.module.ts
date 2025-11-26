import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RegisterModule } from './register/register.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [RegisterModule, AuthModule, ProfileModule, CloudinaryModule],
  providers: [PrismaService],
})
export class AppModule {}
