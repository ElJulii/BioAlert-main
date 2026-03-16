import { Body, Controller, UseGuards, Post, Get, Req, UseInterceptors, Param, UploadedFiles} from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { ReportDto } from "src/dto/report.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";

@Controller("reports")
export class ReportsController {
    constructor(
        private readonly reportsService: ReportsService,
    ) {}


    @UseGuards(JwtAuthGuard)
    @Get("all")
    async getAllReports() {
        return this.reportsService.getAll()
    }

    @UseGuards(JwtAuthGuard)
    @Get("get/:id")
    async getReport(@Param('id') reportId: string) {
        return this.reportsService.getByReportId(reportId)
    }

    @UseGuards(JwtAuthGuard)
    @Get("updates/:id")
    async getReportUpdates(@Param('id') reportId: string) {
        return this.reportsService.getReportUpdatesByReportId(reportId)
    }

    @UseGuards(JwtAuthGuard)
    @Get("me")
    async getUserReports(@Req() req) {
        const userId = req.user.sub
        return this.reportsService.getByUser(userId)

    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Get("assigned")
    async getAssignedReports(@Req() req) {
        const workerId = req.user.sub
        return this.reportsService.getByWorker(workerId)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FilesInterceptor('evidences', 3))
    async create(
        @Req() req,
        @Body() dto: ReportDto,
        @UploadedFiles() files:Express.Multer.File[]     
    ) {

        const userId = req.user.sub
        return this.reportsService.create(userId, dto, files)
    }

    @UseGuards(JwtAuthGuard)
    @Post(":id/assign")
    async setWorker(@Param('id') reportId: string, @Req() req: any) {
        const workerId = req.user.sub

        return this.reportsService.setReportWorker(reportId, workerId)
    }
}