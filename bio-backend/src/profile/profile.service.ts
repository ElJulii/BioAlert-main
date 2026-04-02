import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class ProfileService {
    constructor(
        private prismaService: PrismaService,
        private cloudinaryService: CloudinaryService,
        @Inject('CLOUDINARY') private cloudinaryConfig
    ) {}

    async editProfile(userId: number, file?: Express.Multer.File, username?: string) {

        if (!file && !username) {
            throw new Error("No Data Provided");
        }

        const data: any = {}

        if (file) {
            const upload = await this.cloudinaryService.uploadImageProfile(file, userId);
            data.profilePicture = upload.secure_url;
        }

        if (username) {
            data.username = username;
        }

        const updateUser = await this.prismaService.user.update({
            where: { id: userId },
            data
        });

        return {
            message: "Profile updated successfully",
            image: updateUser.profilePicture,
            username: updateUser.username
        }
    }

}