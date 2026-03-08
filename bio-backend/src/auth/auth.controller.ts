import { Controller, Post, Body, Res, UnauthorizedException, Get, Req, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(
        @Body() body: { identifier: string, password: string },
        @Res({ passthrough: true }) res: Response
    ) {
        const { identifier, password } = body
        if (!identifier || !password) { throw new UnauthorizedException("Missing credentials") }

        const { user, token } = await this.authService.login(identifier, password)

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24
        })

        return { message: 'login successful', user }
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('token')
        return { message: 'logout successful' }
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req: any) {
        const userId = req.user.sub

        const user = await this.authService.getUserById(userId) // vamos a crear este método

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            picture: user.profilePicture,
        }
    }
}