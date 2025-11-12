import { Injectable } from '@nestjs/common';
import { CreateRegisterDto } from '../dto/user.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class RegisterService {

   constructor(private prisma: PrismaService) {}

  create(user: CreateRegisterDto) {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const token = randomBytes(32).toString('hex');
    return this.prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
        verificationToken: token
      }
    })
  }

  findAll() {
     return this.prisma.user.findMany()
  }
}
