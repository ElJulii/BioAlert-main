import { Controller, Get, UseGuards, Param, Post, Req, Body } from "@nestjs/common";
import { UpdatesService } from "./updates.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";

@Controller("actions")
export class UpdatesController {
    constructor(
        private readonly updatesService: UpdatesService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Roles("ADMIN")
    @Post("request/information/:id")
    async requestInformation(@Param("id") id: string, @Req() req, @Body('message') message: string) {
        const workerId = req.user.sub
        return this.updatesService.setUpdateInformation(id, message, workerId)
    }

    @UseGuards(JwtAuthGuard)
    @Roles("ADMIN")
    @Post("progress/:id")
    async progressUpdate(@Param("id") id: string, @Req() req, @Body('message') message: string) {
        const workerId = req.user.sub
        return this.updatesService.setUpdateProgress(id, message, workerId)
    }

    @UseGuards(JwtAuthGuard)
    @Roles("ADMIN")
    @Post("reject/close/:id")
    async rejectClose(@Param("id") id: string, @Req() req, @Body('message') message: string) {
        const workerId = req.user.sub
        return this.updatesService.setRejectionClose(id, message, workerId)
    }

    // user
    @UseGuards(JwtAuthGuard)
    @Post("request/close/:id")
    async requestClose(@Param("id") id: string, @Req() req) {
        const userId = req.user.sub
        return this.updatesService.setRequestClose(userId, id)
    }
}