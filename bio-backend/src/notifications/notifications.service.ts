import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class NotificationsService {
    constructor(
        private prisma: PrismaService
    ) {}

    async getAll() {
        return this.prisma.notification.findMany()
    }

    async getByUser(userId: number) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createAt: 'desc' },
            include: {
                user: true,
                report: true
            }
        })
    }

    async setAsVerified(id: number) {
        return this.prisma.notification.update({
            where: { id },
            data: {
                isVerified: true
            }
        })
    }
}