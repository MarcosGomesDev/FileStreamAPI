import { BadRequestException, Injectable } from '@nestjs/common';
import { Dropbox } from 'dropbox';

@Injectable()
export class AppService {
  private dropbox: Dropbox;

  constructor() {
    this.dropbox = new Dropbox({
      accessToken: process.env.ACCESS_TOKEN,
    });
  }

  async createFolder(path: string) {
    if (!path) {
      throw new BadRequestException('O parâmetro path é obrigatório');
    }

    try {
      const response = await this.dropbox.filesCreateFolderV2({
        path: `/${path}`,
        autorename: false,
      });
      return response;
    } catch (error) {
      console.log(error);
      throw new Error(`Erro ao criar a pasta: ${error.message}`);
    }
  }

  async getFolders() {
    try {
      const response = await this.dropbox.filesListFolder({
        path: '',
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async uploadFile(path: string, fileContent: Buffer): Promise<any> {
    try {
      const response = await this.dropbox.filesUpload({
        path: path,
        contents: fileContent,
      });
      return response.result;
    } catch (error) {
      console.log(error);
    }
  }

  async downloadFile(path: string): Promise<any> {
    try {
      const response = await this.dropbox.filesDownload({ path });
      return response.result;
    } catch (error) {
      console.log(error);
    }
  }
}
