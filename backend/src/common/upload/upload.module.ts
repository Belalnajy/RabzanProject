import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './upload.config';

@Module({
  imports: [MulterModule.register(multerConfig)],
  exports: [MulterModule],
})
export class UploadModule {}
