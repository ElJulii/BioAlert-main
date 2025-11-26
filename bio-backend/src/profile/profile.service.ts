import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class ProfileService {
    constructor(
        private prismaService: PrismaService,
        @Inject('CLOUDINARY') private cloudinaryConfig
    ) {}

    async uploadImage(file: Express.Multer.File, userId: number) {
        if (!file) {
            throw new Error("No file uploaded");
        }
        if (!userId) {
            throw new Error("User not authenticated");
        }

        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        const upload = await cloudinary.uploader.upload(base64, {
           folder: 'bioalert/profile',
           public_id: `user_${userId}`,
           overwrite: true,
        });

        const updateUser = await this.prismaService.user.update({
            where: { id: userId },
            data: { profilePicture: upload.secure_url },
        });

        return {
            message: 'Profile picture was updated successfully',
            image: updateUser.profilePicture,
        };
    }

}