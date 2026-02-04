import { Body, Controller, UseGuards, Post, Get, Req, UseInterceptors, UploadedFile, Param } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { ReportDto } from "src/dto/report.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("reports")
export class ReportsController {
    constructor(
        private readonly reportsService: ReportsService,
    ) {}


    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllReports() {
        return this.reportsService.getAll()
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Req() req, @Body() dto: ReportDto) {
        const userId = req.user.userId || req.user.sub || req.user.id;
        return this.reportsService.create(userId, dto)
    }

    @UseGuards(JwtAuthGuard)
    @Post(":id/upload-evidence")
    @UseInterceptors(FileInterceptor('image'))
    async uploadEvidence(
        @Param('id') reportId: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.reportsService.addEvidence(file, reportId)
    }
}