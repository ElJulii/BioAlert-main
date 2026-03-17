import { Injectable } from "@nestjs/common";
import { ReportDto } from "src/dto/report.dto";
import { PrismaService } from "src/prisma.service";
import { CloudinaryService } from "src/AI/cloudinary.service";
import FormData from 'form-data';
import axios from "axios";
import { ReportState } from "@prisma/client";
import { UserRole } from "@prisma/client";
import { ReportUpdateType } from "@prisma/client";

@Injectable()
export class ReportsService{
    constructor (
        private prisma: PrismaService,
        private cloudinaryService: CloudinaryService
    ) {}

    async create(
        userId: number, 
        dto: ReportDto,
        files: Express.Multer.File[]
    ) {
        
        // Create report
        const report = await this.prisma.report.create({
            data: {
                userId,
                title: dto.title,
                animal: dto.animal,
                description: dto.description,
                country: dto.country,
                city: dto.city,
                address: dto.address,
                date: new Date(dto.date),
            },
        });
        // Set IA
        this.analyzeReportImages(report.id, files);

        return report;
    }

    async getAll() {
        return this.prisma.report.findMany()
    }

    async getByUser(userId: number) {
        return this.prisma.report.findMany({
            where: { userId },
            orderBy: { createAt: 'desc' },
            include: {
                evidences: true
            }
        })
    }

    async getByWorker(workerId: number) {
        return this.prisma.report.findMany({
            where: { assignedToId: workerId },
            orderBy: { createAt: 'desc' },
            include: {
                evidences: true
            }
        })
    }

    async getByReportId(reportId: string) {
        return this.prisma.report.findUnique({
            where: { id: reportId },
            include: {
                evidences: true,
                assignedTo: true,
                user: true
            }
        })
    }

    async getReportUpdatesByReportId(reportId: string) {
        return this.prisma.reportUpdate.findMany({
            where: { reportId: reportId },
            include: {
                user: true,
                report: true
            },
            orderBy: { createdAt: 'asc' }
        })
    }

    private async analyzeReportImages(reportId: string, files: Express.Multer.File[]) {
        try {
            if (!files?.length) return

            const formData = new FormData();
            files.forEach((file) => formData.append('files', file.buffer, { filename: file.originalname, contentType: file.mimetype}))

            type AIResponse = {
                animalDetected: boolean;
                animals: string[];
                error?: string;
            };

            const response = await axios.post<AIResponse>('http://localhost:8000/analyze', formData, {
                headers: formData.getHeaders(),
            });

            const { animalDetected, animals } = response.data

            // Update state based on animals detected
            const report = await this.prisma.report.update({
                where: { id: reportId },
                data: {
                    state: animalDetected ? ReportState.ACCEPTED : ReportState.REJECTED,
                    analysisStatus: "completed",
                    analysisResult: response.data
                },
                select: {
                    id: true,
                    userId: true,
                    state: true
                }
            })

            if (report.state === ReportState.ACCEPTED && files?.length) {
                // Subimos las evidencias solo si fue aceptado
                const evidences = await Promise.all(
                    files.map((file) => this.cloudinaryService.uploadImage(file).then(upload => ({
                        reportId: report.id,
                        url: upload.secure_url
                    })))
                );

                await this.prisma.evidence.createMany({ data: evidences });

                // Creamos la primera ReportUpdate
                await this.prisma.reportUpdate.create({
                    data: {
                        reportId: report.id,
                        userId: report.userId,
                        actorRole: UserRole.USER,
                        type: ReportUpdateType.USER_RESPONSE,
                        message: "Report created and accepted for review."
                    }
                });
            }


            if (!animalDetected) {
                setTimeout(async () => {
                    try {
                        await this.prisma.report.delete({ where: {id: reportId} })
                    } catch (error) {
                        console.error(`Error deleting the report ${reportId}: `, error)
                    }
                }, 60 * 1000)
            }
            
        } catch (error) {
            console.error("Error analyzing report images: ", error)
            await this.prisma.report.update({
                where: { id: reportId },
                data: {
                    analysisStatus: "failed"
                }
            })
        }
    }

    async setReportWorker(reportId: string, workerId: number) {

        const report = await this.prisma.report.findUnique({
            where: { id: reportId },
        })

        if (!report) throw new Error("Report not found")
        if (report.assignedToId) {
            throw new Error("Report already assigned to a worker")
        }

        const workerUsername = await this.prisma.user.findUnique({
            where: { id: workerId },
            select: {
                username: true
            }
        })
        
        await this.prisma.reportUpdate.create({
            data: {
                reportId: reportId,
                userId: workerId,
                message: `Report assigned to ${workerUsername?.username}`,
                actorRole: UserRole.ADMIN,
                type: ReportUpdateType.STATUS_CHANGE
            }
        })
        
        return this.prisma.report.update({
            where: { id: reportId },
            data: {
                assignedTo: {
                    connect: {
                        id: workerId
                    }
                },
                state: ReportState.IN_PROGRESS
            }, 
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        })
    }
}