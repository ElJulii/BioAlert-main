import { Module } from "@nestjs/common";
import { UpdatesController } from "./updates.controller";
import { UpdatesService } from "./updates.service";
import { AuthModule } from "src/auth/auth.module";
import { PrismaService } from "src/prisma.service";

@Module({
    imports: [
        AuthModule
    ],
    controllers: [UpdatesController],
    providers: [UpdatesService, PrismaService],
})
export class UpdatesModule { }