import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_EXTENSIONS = [
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
];

const ALLOWED_MIMES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const multerConfig = {
  storage: diskStorage({
    destination: process.env.UPLOAD_DIR || './uploads',
    filename: (_req, file, cb) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (
    _req: any,
    file: Express.Multer.File,
    cb: (error: Error | null, accepted: boolean) => void,
  ) => {
    const ext = extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext) && ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          'نوع الملف غير مسموح به. الأنواع المسموحة: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX',
        ),
        false,
      );
    }
  },
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  },
};
