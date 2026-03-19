import { Module } from "@nestjs/common";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";
import { PrismaService } from "src/prisma.service";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { AuthModule } from "src/auth/auth.module";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

@Module({
    imports: [
        CloudinaryModule,
        AuthModule
    ],
    controllers: [ReportsController],
    providers: [ReportsService, PrismaService, CloudinaryService],
})
export class ReportsModule{}