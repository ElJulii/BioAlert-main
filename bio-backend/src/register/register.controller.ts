import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateRegisterDto } from '../dto/user.dto';


@Controller('/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  create(@Body() user: CreateRegisterDto) {
    return this.registerService.create(user);
  }

  @Get()
  findAll() {
    return this.registerService.findAll();
  }

}
