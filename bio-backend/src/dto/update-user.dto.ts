import { PartialType } from '@nestjs/mapped-types';
import { CreateRegisterDto } from './user.dto';

export class UpdateRegisterDto extends PartialType(CreateRegisterDto) {}
