import { Inject, Injectable } from "@nestjs/common";
import { AiAnalysisService } from "src/AI/ai-analysis.service";
import { ReportDto } from "src/dto/report.dto";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ReportsService{
    constructor (
        private prisma: PrismaService,
        // private aiService: AiAnalysisService,
        @Inject('CLOUDINARY') private cloudinary
    ) {}

    async create(userId: number, dto: ReportDto) {
        const report = await this.prisma.report.create({
            data: {
                userId,
                title: dto.title,
                animal: dto.animal,
                description: dto.description,
                country: dto.country,
                city: dto.city,
                address: dto.address,
                date: new Date(dto.date)
            }
        })

        // const aiResult = await this.aiService.analyzeReport(report);
        // await this.prisma.report.update({
        //     where: { id: report.id },
        //     data: {
        //         analysisStatus: aiResult.status,
        //         analysisResult: aiResult
        //     }
        // })

        // return report;
    }


    async addEvidence(file: Express.Multer.File, reportId: string) {

        if (!file) throw new Error("The file could not be found");

        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`

        const upload = await this.cloudinary.uploader.upload(base64, {
            folder: 'bioalert/reports/evidences',
        })
        return this.prisma.evidence.create({
            data: {
                reportId,
                url: upload.secure_url
            }
        })
    }

    async getAll() {
        return this.prisma.report.findMany()
    }
}