import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

@Injectable()
export class UpdatesService {
    constructor(
        private prisma: PrismaService,
        private cloudinaryService: CloudinaryService
    ) {}

    private async getUsernameByIdComplaint(complaintId: string) {
        const user = await this.prisma.report.findUnique({
            where: { id: complaintId },
            select: {
                user : true
            }
        })

        return user?.user?.username
    }

    private async getWorkerByIdReport(reportId: string) {
        const report = await this.prisma.report.findUnique({
            where: { id: reportId },
            select: {
                assignedToId: true
            }
        })

        return report?.assignedToId
    }

    private async getUserIdByReportId(reportId: string) {
        const report = await this.prisma.report.findUnique({
            where: { id: reportId },
            select: {
                userId: true
            }
        })

        return report?.userId
    }

    async setUpdateInformation(id: string, message: string, workerId: number) {

        const userId = await this.getUserIdByReportId(id)

        if (!userId) throw new Error("User not found")

        await this.prisma.notification.create({
            data: {
                userId: userId,
                reportId: id,
                message: "The operator has requested additional information. Send it as soon as possible.",
                state: "REQUEST_INFO"
            }
        })

        return this.prisma.reportUpdate.create({
            data: {
                reportId: id,
                userId: workerId,
                message: message,
                actorRole: "ADMIN",
                type: "REQUEST_INFO"
            }
        })
    }

    async setUpdateProgress(id: string, message: string, workerId: number) {

        const userId = await this.getUserIdByReportId(id)

        if (!userId) throw new Error("User not found")

        await this.prisma.notification.create({
            data: {
                userId: userId,
                reportId: id,
                message: "The operator has sent you an update. Please, check it.",
                state: "PROGRESS_UPDATE"
            }
        })

        return this.prisma.reportUpdate.create({
            data: {
                reportId: id,
                userId: workerId,
                message: message,
                actorRole: "ADMIN",
                type: "PROGRESS_UPDATE"
            }
        })
    }

    async setAcceptanceClose(complaintId: string, workerId: number) {

        const username = await this.getUsernameByIdComplaint(complaintId)
        const userId = await this.getUserIdByReportId(complaintId)

        await this.prisma.report.update({
            where: { id: complaintId },
            data: {
                state: "CANCELED"
            }
        })

        if (!userId) throw new Error("User not found")

        await this.prisma.notification.create({
            data: {
                userId: userId,
                reportId: complaintId,
                message: "The operator has cancelled and close the complaint.",
                state: "STATUS_CHANGE"
            }
        })

        return this.prisma.reportUpdate.create({
            data: {
                reportId: complaintId,
                userId: workerId,
                message: `Dear ${username}, the complaint has been closed, thank you for your cooperation.`,
                actorRole: "ADMIN",
                type: "STATUS_CHANGE"
            }
        })
    }


    async setRejectionClose(id: string, message: string, workerId: number) {

        const userId = await this.getUserIdByReportId(id)

        if (!userId) throw new Error("User not found")

        await this.prisma.notification.create({
            data: {
                userId: userId,
                reportId: id,
                message: "The operator has rejected your request to close the complaint.",
                state: "CLOSE_REJECTED"
            }
        })

        return this.prisma.reportUpdate.create({
            data: {
                reportId: id,
                userId: workerId,
                message: message,
                actorRole: "ADMIN",
                type: "CLOSE_REJECTED"
            }
        })
    }

    async setResolvedComplaint(id: string, workerId: number) {
        const username = await this.getUsernameByIdComplaint(id)
        const userId = await this.getUserIdByReportId(id)

        if (!userId) throw new Error("User not found")

        await this.prisma.report.update({
            where: { id: id },
            data: {
                state: "RESOLVED"
            }
        })

        await this.prisma.notification.create({
            data: {
                userId: userId,
                reportId: id,
                message: "The operator has resolved the complaint.",
                state: "STATUS_CHANGE"
            }
        })

        return this.prisma.reportUpdate.create({
            data: {
                reportId: id,
                userId: workerId,
                message: `Dear ${username}, the complaint has been resolved, thank you for your cooperation.`,
                actorRole: "ADMIN",
                type: "STATUS_CHANGE"
            }
        })
    }

    // User

    async setRequestClose(userId: number, reportId: string) {

        const user = await this.prisma.user.findUnique({ 
            where: { id: userId },
            select: {
                username: true
            }
        })

        const workerId = await this.getWorkerByIdReport(reportId)

        await this.prisma.report.update({
            where: { id: reportId },
            data: {
                requestClose: true
            }
        })

        if (!workerId) throw new Error("Worker not found")

        await this.prisma.notification.create({
            data: {
                userId: workerId,
                reportId: reportId,
                message: `The user ${user?.username} has requested to close the complaint`,
                state: "REQUEST_CLOSE"
            }
        })
    
        return this.prisma.reportUpdate.create({
            data: {
                reportId: reportId,
                userId: userId,
                message: `The user ${user?.username} has requested to close the complaint`,
                actorRole: "USER",
                type: "REQUEST_CLOSE"
            }
        })
    }

    async setNewInformation(
        reportId: string,
        message: string,
        userId: number,
        file?: Express.Multer.File
    ) {

        const update = await this.prisma.reportUpdate.create({
            data: {
                reportId: reportId,
                userId: userId,
                message: message,
                actorRole: "USER",
                type: "USER_RESPONSE"
            }
        })

        const username = await this.getUsernameByIdComplaint(reportId)

        const workerId = await this.getWorkerByIdReport(reportId)
        if (!workerId) throw new Error("Worker not found")
        
        await this.prisma.notification.create({
            data: {
                userId: workerId,
                reportId: reportId,
                message: `The user ${username} has sent more information, please, check it.`,
                state: "USER_RESPONSE"
            }
        })

        if (file) {
            const upload = await this.cloudinaryService.uploadImage(file)
            await this.prisma.evidence.create({
                data: {
                    reportId: reportId,
                    url: upload.secure_url
                }
            })
        }

        return update
    }
}