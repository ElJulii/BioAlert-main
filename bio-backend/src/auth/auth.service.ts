import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{email: username}, {username: username}],
            }
        })

        if (!user) {
            throw new UnauthorizedException("User not found")
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) { throw new UnauthorizedException("Password incorrect") }

        const {password: _, ...result} = user
        return result
    }

    async login(identifier: string, password: string) {
        const user = await this.validateUser(identifier, password)

        const payload = { sub: user.id, username: user.username, email: user.email }
        const token = this.jwtService.sign(payload)

        return {
            user,
            token
        }
    }
}