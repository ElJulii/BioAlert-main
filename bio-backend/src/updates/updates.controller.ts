import { Controller, Get, UseGuards, Param, Post, Req, Body, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UpdatesService } from "./updates.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { FileInterceptor } from '@nestjs/platform-express';

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
    @Post("accept/close/:id")
    async acceptClose(@Param("id") id: string, @Req() req) {
        const workerId = req.user.sub
        return this.updatesService.setAcceptanceClose(id, workerId)
    }

    @UseGuards(JwtAuthGuard)
    @Roles("ADMIN")
    @Post("reject/close/:id")
    async rejectClose(@Param("id") id: string, @Req() req, @Body('message') message: string) {
        const workerId = req.user.sub
        return this.updatesService.setRejectionClose(id, message, workerId)
    }

    @UseGuards(JwtAuthGuard)
    @Roles("ADMIN")
    @Post("resolve/:id")
    async resolveComplaint(@Param("id") id: string, @Req() req) {
        const workerId = req.user.sub
        return this.updatesService.setResolvedComplaint(id, workerId)
    }

    // user
    @UseGuards(JwtAuthGuard)
    @Post("request/close/:id")
    async requestClose(@Param("id") id: string, @Req() req) {
        const userId = req.user.sub
        return this.updatesService.setRequestClose(userId, id)
    }

    @UseGuards(JwtAuthGuard)
    @Post("new/information/:id")
    @UseInterceptors(FileInterceptor('image'))
    async newInformation(@Param("id") id: string, @Req() req, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
        const userId = req.user.sub
        const message = body.message
        return this.updatesService.setNewInformation(id, message, userId, file)
    }
}