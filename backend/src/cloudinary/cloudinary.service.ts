import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });
  }

    async uploadImage(file: Express.Multer.File, carpeta: string): Promise<string> {
        return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: carpeta,
                resource_type: 'image' },
            (error, result) => {
            if (error || !result) {
                console.error('Error al subir la imagen a Cloudinary:', error);
                return reject(error);
            }
            resolve(result.secure_url);
            },
        );
        Readable.from(file.buffer).pipe(uploadStream);
        });
  
    }
}
