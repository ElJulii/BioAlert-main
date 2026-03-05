import { Body, Controller, UseGuards, Post, Get, Req, UseInterceptors, UploadedFile, Param, UploadedFiles } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { ReportDto } from "src/dto/report.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

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
    @Get("me")
    async getUserReports(@Req() req) {
        const userId = req.user.sub
        return this.reportsService.getByUser(userId)

    }

    
    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('evidences', 3))
    async create(
        @Req() req,
        @Body() dto: ReportDto,
        @UploadedFiles() files:Express.Multer.File[]     
    ) {
        console.log("User: ", req.user)
        console.log("DTO: ", dto)

        const userId = req.user.sub
        return this.reportsService.create(userId, dto, files)
    }

    // @UseGuards(JwtAuthGuard)
    // @Post(":id/upload-evidence")
    // @UseInterceptors(FileInterceptor('image'))
    // async uploadEvidence(
    //     @Param('id') reportId: string,
    //     @UploadedFile() file: Express.Multer.File
    // ) {
    //     return this.reportsService.addEvidence(file, reportId)
    // }
}