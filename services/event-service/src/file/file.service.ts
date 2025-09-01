import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class FileService {

  async saveEventImage(
    // fileBuffer: Buffer,
    // eventId: number,
    fileName: string,
    // isEdit = false,
    folderPath: string = 'events/banner-image',
  ): Promise<string> {
    try {
      const basePath = join(process.cwd(), 'uploads', folderPath);
      const fullPath = join(basePath, fileName);
      
      // Ensure the folder exists
    //   await fs.mkdir(basePath, { recursive: true });
    //   if (isEdit) {
    //     try {
    //       await fs.access(fullPath);
    //       await fs.unlink(fullPath);
    //       this.logger.log(`Deleted old image: ${fullPath}`);
    //     } catch {
    //       this.logger.warn(`Old image not found for deletion: ${fullPath}`);
    //     }
    //   }
    //   await fs.writeFile(fullPath, fileBuffer);
      return fileName;
    } catch (error) {
      throw new InternalServerErrorException('Could not save image');
    }
  }
}
