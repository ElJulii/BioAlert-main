import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
    private transporter 

    constructor() {

        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendMailVerification(email: string, token: string) {
        const verificationUrl = `http://localhost:3001/auth/verify-email?token=${token}`

        await this.transporter.sendMail({
            from: `"BioAlert" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Verify your email",
           html: `
                <h2>Welcome to BioAlert</h2>
                <p>Click the button below to verify your account:</p>

                <a href="${verificationUrl}"
                style="
                    background:#16a34a;
                    padding:12px 20px;
                    color:white;
                    text-decoration:none;
                    border-radius:6px;
                    display:inline-block;
                ">
                Verify Account
                </a>

                <p>If you did not create this account, ignore this email.</p>
            `
        });

    }

    async sendVerifiedSuccessEmail(email: string) {

        await this.transporter.sendMail({
            from: `"BioAlert" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Email verified successfully",
            html: `
            <h2>Your email has been verified ✅</h2>
            <p>Your BioAlert account is now verified.</p>

            <a href="http://localhost:3000"
                style="
                background:#2563eb;
                padding:12px 20px;
                color:white;
                text-decoration:none;
                border-radius:6px;
                display:inline-block;
                ">
                Go to BioAlert
            </a>
            `
        })
    }
}