import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { PrismaService } from "../prisma.service";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [CloudinaryModule, AuthModule],
    controllers: [ProfileController],
    providers: [ProfileService, PrismaService],
})
export class ProfileModule{}