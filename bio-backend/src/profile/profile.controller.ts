// import { UseGuards } from "@nestjs/common";
// import { Controller, Get, Req } from "@nestjs/common";
// import { ProfileService } from "./profile.service";
// import { JwtAuthGuard } from "../auth/jwt-auth.guard";
// import { AuthGuard } from "@nestjs/passport";

// @Controller("profile")
// export class ProfileController {
//     constructor(private readonly profileService: ProfileService) {}

//     @UseGuards(AuthGuard('jwt'))
//     @Get()
//     getProfile(@Req() req) {
//         const userId = req.user.userId
//         return this.profileService.getProfile(userId)
//     }
    
// }