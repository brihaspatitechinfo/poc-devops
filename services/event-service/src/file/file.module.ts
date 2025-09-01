// src/file/file.module.ts

import { Module } from '@nestjs/common';
import { FileService } from './file.service';

@Module({
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
