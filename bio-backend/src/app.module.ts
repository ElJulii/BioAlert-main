import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RegisterModule } from './register/register.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [RegisterModule, AuthModule],
  providers: [PrismaService],
})
export class AppModule {}
