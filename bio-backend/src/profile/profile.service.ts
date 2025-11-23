import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ProfileService {
    constructor(private prismaService: PrismaService) {}

    async getProfile(userId: number) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
            select: {
                username: true,
                email: true,
            }
        })

        return user
    }
}