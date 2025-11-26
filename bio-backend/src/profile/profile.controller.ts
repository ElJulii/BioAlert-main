import { Post, UseInterceptors, UploadedFile, Controller, Get, Req, UseGuards  } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("profile")
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Post('upload-image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req) {
        const userId = req.user.sub

        return this.profileService.uploadImage(file, userId)
    }
    
}