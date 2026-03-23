import { Controller, Get, Post, Req, Param, UploadedFile, UseGuards, Body, UseInterceptors } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationDTO } from 'src/dto/publication.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async setPublication(
    @Req() req,
    @Body() dto: PublicationDTO,
    @UploadedFile() image?: Express.Multer.File
  ) {
    return await this.publicationsService.createPublication(req.user.sub, dto, dto.idReport ?? undefined, image);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('all')
  async getAllPublications() {
    return await this.publicationsService.getAllPublications();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('id/:id')
  async getPublicationById(@Param('id') id: number) {
    return await this.publicationsService.getPublicationById(id);
  }
}
