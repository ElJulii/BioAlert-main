import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { randomBytes } from "node:crypto";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    // private transporter = nodemailer.createTransport({
    //     host: process.env.SMTP_HOST,
    //     port: parseInt(process.env.SMTP_PORT),
    //     secure: false,
    //     auth: {
    //         user: process.env.SMTP_USER,
    //         pass: process.env.SMTP_PASSWORD,
    //     },
    // });

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

    // send verification email
    // async sendVerificationEmail(email: string, token: string) {
    //     const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;

    //     const mailOptions = {
    //     from: `"BioAlert" <${process.env.SMTP_USER}>`,
    //     to: email,
    //     subject: "Verify your email",
    //     html: `
    //         <h2>Verify your email for BioAlert</h2>
    //         <p>Click the link below to verify your account:</p>
    //         <a href="${verificationUrl}">Verify Email</a>
    //     `
    //     };

    //     try {
    //     await this.transporter.sendMail(mailOptions);
    //     console.log(`Verification email sent to ${email}`);
    //     } catch (error) {
    //     console.error("Error sending email:", error);
    //     }
    // }

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
                    password: "", // google no usa password
                    googleId: googleUser.googleId,
                    provider: "google",
                    profilePicture: googleUser.picture,
                    verificationToken: verificationToken,
                    isVerified: false
                }
            })

            // await this.sendVerificationEmail(user.email, verificationToken)
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
}