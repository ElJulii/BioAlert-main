import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export class CloudinaryService {
    constructor(@Inject('CLOUDINARY') private cloudinary) {}

    async uploadImage(file: Express.Multer.File) {

        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        return this.cloudinary.uploader.upload(base64, {
            folder: "bioalert/reports/evidences",
        });
    }
}