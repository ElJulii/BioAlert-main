import { Controller, Get, UseGuards, Req, Post, Param } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ParseIntPipe } from "@nestjs/common";

@Controller('notifications')
export class NotificationsController {
    constructor(
        private readonly notificationsService: NotificationsService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async userNotifications(@Req() req) {
        const userId = req.user.sub
        return this.notificationsService.getByUser(userId)
    }

    @UseGuards(JwtAuthGuard)
    @Post("verify/:id")
    async verifyNotification(@Param("id", ParseIntPipe) id: number) {
        return this.notificationsService.setAsVerified(id)
    }
} 