import { Module } from "@nestjs/common";
import { UpdatesController } from "./updates.controller";
import { UpdatesService } from "./updates.service";
import { AuthModule } from "src/auth/auth.module";
import { PrismaService } from "src/prisma.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";

@Module({
    imports: [
        CloudinaryModule,
        AuthModule
    ],
    controllers: [UpdatesController],
    providers: [UpdatesService, PrismaService, CloudinaryService],
})
export class UpdatesModule { }