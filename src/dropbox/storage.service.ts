import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Dropbox } from 'dropbox';
import { UserService } from '../user/user.service';

@Injectable()
export class StorageService {
  constructor(private readonly userService: UserService) {}

  private async initializeDropbox(userId: string): Promise<Dropbox> {
    const user = await this.userService.findOne(userId);

    if (!user.dropBoxAuth) {
      throw new UnauthorizedException('Dropbox credentials not found');
    }

    return new Dropbox({
      clientId: user.dropBoxAuth.clientId,
      clientSecret: user.dropBoxAuth.clientSecret,
      accessToken: user.dropBoxAuth.accessToken,
      refreshToken: user.dropBoxAuth.refreshToken,
    });
  }

  async createFolder(userId: string, path: string) {
    if (!path) {
      throw new BadRequestException('O parâmetro path é obrigatório');
    }

    const dropbox = await this.initializeDropbox(userId);

    try {
      const response = await dropbox.filesCreateFolderV2({
        path: `/${path}`,
        autorename: false,
      });

      return response;
    } catch (error) {
      console.log(error);
      throw new Error(`Erro ao criar a pasta: ${error.message}`);
    }
  }

  async getFolders(userId: string) {
    const dropbox = await this.initializeDropbox(userId);

    try {
      const response = await dropbox.filesListFolder({
        path: '',
      });

      console.log(response.result);

      return response.result.entries
        .filter((entry) => entry['.tag'] === 'folder')
        .map((entry) => {
          return {
            name: entry.name,
            path: entry.path_lower,
            tag: entry['.tag'],
          };
        });
    } catch (error) {
      console.log(error);
    }
  }

  async getFolderContent(userId: string, path: string, newCursor: string) {
    if (!path) {
      throw new BadRequestException('O parâmetro path é obrigatório');
    }

    const dropbox = await this.initializeDropbox(userId);

    try {
      if (newCursor) {
        const { result } = await dropbox.filesListFolderContinue({
          cursor: newCursor,
        });

        return {
          data: result.entries.map((entry) => {
            return {
              name: entry.name,
              path: entry.path_lower,
              tag: entry['.tag'],
            };
          }),
          cursor: result.cursor,
          hasMore: result.has_more,
        };
      }

      const response = await dropbox.filesListFolder({
        path: `/${path}`,
        limit: 10,
      });

      return {
        data: response.result.entries.map((entry) => {
          return {
            name: entry.name,
            path: entry.path_lower,
            tag: entry['.tag'],
          };
        }),
        cursor: response.result.cursor,
        hasMore: response.result.has_more,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async uploadFile(
    userId: string,
    path: string,
    fileContent: Buffer,
  ): Promise<any> {
    if (!path) {
      throw new BadRequestException('O parâmetro path é obrigatório');
    }

    const dropbox = await this.initializeDropbox(userId);

    try {
      const response = await dropbox.filesUpload({
        path: path,
        contents: fileContent,
      });
      return response.result;
    } catch (error) {
      console.log(error);
    }
  }

  async downloadFile(userId: string, path: string): Promise<any> {
    if (!path) {
      throw new BadRequestException('O parâmetro path é obrigatório');
    }

    const dropbox = await this.initializeDropbox(userId);

    try {
      const response = await dropbox.filesDownload({ path });
      return response.result;
    } catch (error) {
      console.log(error);
    }
  }
}
