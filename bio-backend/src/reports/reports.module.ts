import { Module } from "@nestjs/common";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";
import { PrismaService } from "src/prisma.service";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [
        CloudinaryModule,
        AuthModule
    ],
    controllers: [ReportsController],
    providers: [ReportsService, PrismaService],
})
export class ReportsModule{}