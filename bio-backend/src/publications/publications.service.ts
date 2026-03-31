import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PublicationDTO } from 'src/dto/publication.dto';

@Injectable()
export class PublicationsService {
    constructor(
        private prisma: PrismaService,
        private cloudinaryService: CloudinaryService
    ) {}

    async getAllPublications() {
        return await this.prisma.news.findMany({
            orderBy: {
                 date_new: "desc"
            }, include: {
                comments: true,
                likes: true,
                worker: true
            }
        });
    }

    async getAllPublicationsAsReports() {
        return await this.prisma.news.findMany({
            where: {
                idReport: {
                    not: null
                }
            }
        })
    }

    async getPublicationById(id: number) {
        return await this.prisma.news.findMany({
            where: {
                idWorker: id
            },
            include: {
                comments: true,
                likes: true
            },
            orderBy: {
                date_new: "desc"
            }
        });
    }

    async createPublication(userId: number, publicationDto: PublicationDTO, complaintId?: string,  image?: Express.Multer.File) {

        return this.prisma.$transaction(async (tx) => {

            const imageUpload = image 
                ? await this.cloudinaryService.uploadImagePublication(image) 
                : null;

            // 1. create news
            const publication = await tx.news.create({
                data: {
                    idWorker: userId,
                    idReport: complaintId || null,
                    title: publicationDto.title,
                    context: publicationDto.description,
                    place: publicationDto.place,
                    image_url: imageUpload?.secure_url || null,
                }
            });

            // 2. If there is a complaintId, create a notification and update report state
            if (complaintId) {

                const report = await tx.report.findUnique({
                    where: { id: complaintId },
                    select: { userId: true }
                });

                if (!report) throw new Error('Report not found');

                // 3. User notification
                await tx.notification.create({
                    data: {
                        userId: report.userId,
                        message: `Your case has been published as news.`,
                        state: 'STATUS_CHANGE',
                        reportId: complaintId,
                    }
                });

                // 4. Update report state
                await tx.report.update({
                    where: { id: complaintId },
                    data: {
                        state: "PUBLISHED"
                    }
                });

                // 5. Admin notification
                await tx.notification.create({
                    data: {
                        userId: userId,
                        message: `You have published the case ${complaintId} as news.`,
                        state: 'STATUS_CHANGE',
                        reportId: complaintId || null,
                    }
                });
            } else {
                await tx.notification.create({
                    data: {
                        userId: userId,
                        message: "Your case has been published in news.",
                        state: 'STATUS_CHANGE',
                        reportId: complaintId || null,
                    }
                });
            }

            return publication;
        });
    }
}
