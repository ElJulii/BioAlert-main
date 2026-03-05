import { Inject, Injectable } from "@nestjs/common";
import { ReportDto } from "src/dto/report.dto";
import { PrismaService } from "src/prisma.service";
import FormData from 'form-data';
import axios from "axios";
import { ReportState } from "@prisma/client";

@Injectable()
export class ReportsService{
    constructor (
        private prisma: PrismaService,
        @Inject('CLOUDINARY') private cloudinary
    ) {}

    async create(
        userId: number, 
        dto: ReportDto,
        files: Express.Multer.File[]
    ) {
        return this.prisma.$transaction(async (tx) => {
        const report = await tx.report.create({
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

        // Upload evidences
        if (files?.length) {
            const evidences = await Promise.all(
                files.map(async (file) => {
                    const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

                    const upload = await this.cloudinary.uploader.upload(base64, {
                        folder: "bioalert/reports/evidences",
                    });

                    return {
                        reportId: report.id,
                        url: upload.secure_url,
                    };
                })
            );

            await tx.evidence.createMany({
                data: evidences,
            });
        }

        // Call AI in secondary transaction
        this.analyzeReportImages(report.id, files)

        return tx.report.findUnique({
            where: { id: report.id },
            include: { evidences: true }
        });
    });      
    }


    // async addEvidence(file: Express.Multer.File, reportId: string) {

    //     if (!file) throw new Error("The file could not be found");

    //     const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`

    //     const upload = await this.cloudinary.uploader.upload(base64, {
    //         folder: 'bioalert/reports/evidences',
    //     })
    //     return this.prisma.evidence.create({
    //         data: {
    //             reportId,
    //             url: upload.secure_url
    //         }
    //     })
    // }

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
            await this.prisma.report.update({
                where: { id: reportId },
                data: {
                    state: animalDetected ? ReportState.ACCEPTED : ReportState.REJECTED,
                    analysisStatus: "completed",
                    analysisResult: response.data
                }
            })
            
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
}