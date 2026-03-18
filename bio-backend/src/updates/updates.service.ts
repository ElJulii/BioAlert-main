import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UpdatesService {
    constructor(
        private prisma: PrismaService
    ) {}

    async getUsernameByIdComplaint(complaintId: string) {
        const user = await this.prisma.report.findUnique({
            where: { id: complaintId },
            select: {
                user : true
            }
        })

        return user?.user?.username
    }

    async setUpdateInformation(id: string, message: string, workerId: number) {

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

        await this.prisma.report.update({
            where: { id: complaintId },
            data: {
                state: "CANCELED"
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

        await this.prisma.report.update({
            where: { id: id },
            data: {
                state: "RESOLVED"
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

        await this.prisma.report.update({
            where: { id: reportId },
            data: {
                requestClose: true
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
}