import { Injectable } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';

@Injectable()
export class RegisterService {

   private arrayUs: any = []

  create(user: CreateRegisterDto) {
    this.arrayUs.push(user)
    return(user)
  }

  findAll() {
     return this.arrayUs
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} register`;
  // }

  // update(id: number, updateRegisterDto: UpdateRegisterDto) {
  //   return `This action updates a #${id} register`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} register`;
  // }
}
