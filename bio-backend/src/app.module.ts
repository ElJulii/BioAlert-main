import { Module } from '@nestjs/common';
import { HomeModule } from './home/home.module';
import { RegisterModule } from './register/register.module';

@Module({
  imports: [HomeModule, RegisterModule],
})
export class AppModule {}
