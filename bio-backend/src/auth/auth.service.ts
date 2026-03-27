import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { randomBytes } from "node:crypto";
import { MailService } from "../mail/mail.service";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private mailService: MailService,
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

        const payload = { 
            sub: user.id, 
            username: user.username, 
            email: user.email, 
            picture: user.profilePicture,
            role: user.role,
            provider: "local"
        }
        const token = this.jwtService.sign(payload)

        return {
            user,
            token
        }
    }

    async getUserById(userId: number) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                profilePicture: true,
                role: true
            }
        })
    }

    //Google
    async googleLogin(googleUser: any) {
        let user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: googleUser.email }, { googleId: googleUser.id }]
            }
        })

        if (!user) {
            const verificationToken = randomBytes(32).toString('hex')
            user = await this.prisma.user.create({
                data: {
                    name: googleUser.name,
                    surname: googleUser.surname,
                    username: googleUser.email.split("@")[0] + Math.floor(Math.random()*1000),
                    email: googleUser.email,
                    password: "", 
                    googleId: googleUser.googleId,
                    provider: "google",
                    profilePicture: googleUser.picture,
                    verificationToken: verificationToken,
                    isVerified: false
                }
            })

            // this.mailService
            //     .sendMailVerification(user.email, verificationToken)
            //     .catch(err => console.log("Mail error:", err.message))
        }

        const payload = { 
            sub: user.id, 
            username: user.username, 
            email: user.email, 
            picture: user.profilePicture,
            role: user.role
        }
        const token = this.jwtService.sign(payload)

        return {
            user,
            token
        }
    }

    async verifyEmail(token: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                verificationToken: token
            }
        })

        if (!user) {
            throw new Error("Invalid token")
        }

        const updatedUser = await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                isVerified: true,
                verificationToken: null
            }
        })

        this.mailService.sendVerifiedSuccessEmail(user.email)

        return updatedUser
    }
}