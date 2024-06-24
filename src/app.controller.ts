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
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/get-folders')
  async getFolders() {
    return await this.appService.getFolders();
  }

  @Get('/download-file')
  async downloadFile(@Query('path') path: string, @Res() res: Response) {
    const file = await this.appService.downloadFile(path);

    console.log(file);

    // Configurar headers para download do arquivo
    res.setHeader('Content-Disposition', `attachment; filename=${file.name}`);
    const mimeType = this.getMimeTypeFromFileName(file.name);
    if (mimeType) {
      res.setHeader('Content-Type', mimeType);
    }

    // Enviar conteúdo do arquivo como resposta
    res.send(file.fileBinary);
  }

  @Post('/create-folder')
  async createFolder(@Query('path') path: string) {
    return await this.appService.createFolder(path);
  }

  @Post('/upload-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('path') path: string,
  ) {
    const filePath = `/${path}/${file.originalname}`;
    return await this.appService.uploadFile(filePath, file.buffer);
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
}
