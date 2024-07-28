import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Public } from '../decorators/public.decorator';
import { UserId } from '../decorators/user-id.decorator';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('/get-folders')
  async getFolders() {
    return await this.storageService.getFolders();
  }

  @Get('/get-folder')
  async getFolder(@Query('path') path: string) {
    return await this.storageService.getFolderContent(path);
  }

  @Get('/get-url')
  getUrl(@Query('path') path: string) {
    return this.storageService.getPublicUrl(path);
  }

  @Public()
  @Get('/download-file')
  async downloadFile(@Query('path') path: string, @Res() res: Response) {
    try {
      const fileBuffer = await this.storageService.downloadFile(path);
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename=${path.split('/').pop()}`,
        'Content-Length': fileBuffer.length,
      });
      res.send(fileBuffer);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  @Post('/create-folder')
  async createFolder(@UserId() userId: string, @Query('path') path: string) {
    return await this.storageService.createFolder(userId, path);
  }

  @Post('/upload-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('path') path: string,
  ) {
    const filePath = `${path}/${this.renameFile(file.originalname)}`;
    return await this.storageService.uploadFile(filePath, file.buffer);
  }

  private getMimeTypeFromFileName(filename: string): string | undefined {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'application/pdf';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'txt':
        return 'text/plain';
      case 'mp3':
        return 'audio/mpeg'; // Exemplo para arquivo MP3
      case 'wav':
        return 'audio/wav'; // Exemplo para arquivo WAV
      case 'ogg':
        return 'audio/ogg'; // Exemplo para arquivo OGG
      default:
        return undefined; // Retorne undefined se o tipo MIME não for conhecido
    }
  }

  private renameFile(filename: string) {
    let formatted = filename
      .replaceAll(' ', '_')
      .replaceAll('#', '')
      .replaceAll('?', '');

    const utf8ToAsciiMap = {
      á: 'a',
      à: 'a',
      ã: 'a',
      â: 'a',
      ä: 'a',
      é: 'e',
      è: 'e',
      ê: 'e',
      ë: 'e',
      í: 'i',
      ì: 'i',
      î: 'i',
      ï: 'i',
      ó: 'o',
      ò: 'o',
      õ: 'o',
      ô: 'o',
      ö: 'o',
      ú: 'u',
      ù: 'u',
      û: 'u',
      ü: 'u',
      ç: 'c',
      ñ: 'n',
      Á: 'A',
      À: 'A',
      Ã: 'A',
      Â: 'A',
      Ä: 'A',
      É: 'E',
      È: 'E',
      Ê: 'E',
      Ë: 'E',
      Í: 'I',
      Ì: 'I',
      Î: 'I',
      Ï: 'I',
      Ó: 'O',
      Ò: 'O',
      Õ: 'O',
      Ô: 'O',
      Ö: 'O',
      Ú: 'U',
      Ù: 'U',
      Û: 'U',
      Ü: 'U',
      Ç: 'C',
      Ñ: 'N',
    };

    for (const key in utf8ToAsciiMap) {
      formatted = formatted.replaceAll(key, utf8ToAsciiMap[key]);
    }

    return formatted;
  }
}
