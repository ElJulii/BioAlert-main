import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

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
} 