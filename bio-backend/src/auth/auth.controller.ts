import { Controller, Post, Body, Res, UnauthorizedException, Get, Req, UseGuards, Query, NotFoundException } from "@nestjs/common";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthGuard } from "@nestjs/passport";
import { PrismaService } from "../prisma.service";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private prisma: PrismaService) {}

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

        const user = await this.authService.getUserById(userId) 

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            picture: user.profilePicture,
            role: user.role
        }
    }

    //By Google
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {}

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthCallback(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        const { user, token } = await this.authService.googleLogin(req.user)

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24
        })

        res.redirect('http://localhost:3000')
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string, @Res() res: Response) {

        const user = await this.authService.verifyEmail(token)

        return res.redirect('http://localhost:3000/email-verified')
    }
}