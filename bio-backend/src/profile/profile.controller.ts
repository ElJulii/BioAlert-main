import { Post, UseInterceptors, UploadedFile, Controller, Get, Req, UseGuards, Body  } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("profile")
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Post('edit-profile')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(@Req() req, @UploadedFile() file: Express.Multer.File, @Body('username') username: string) {
        const userId = req.user.sub

        return this.profileService.editProfile(userId, file, username);
    }
    
}