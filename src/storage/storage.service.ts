import { BadRequestException, Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import axios from 'axios';
import { UserService } from '../user/user.service';

@Injectable()
export class StorageService {
  private readonly supabase: SupabaseClient;
  constructor(private readonly userService: UserService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_API_KEY,
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async createFolder(userId: string, path: string) {
    if (!path) {
      throw new BadRequestException('O parâmetro path é obrigatório');
    }

    const { data, error } = await this.supabase.storage
      .from('r3_buzinas')
      .upload(`${path}`, 'texte.txt');

    if (error) {
      throw new BadRequestException(`Error creating folder: ${error.message}`);
    }

    return data;
  }

  async getFolders(): Promise<any> {
    const { data, error } = await this.supabase.storage
      .from('r3_buzinas')
      .list('');

    if (error) {
      throw new BadRequestException(`Error listing folders: ${error.message}`);
    }

    return data;
  }

  async getFolderContent(path: string): Promise<any> {
    if (!path) {
      throw new BadRequestException('O parâmetro path é obrigatório');
    }

    const { data, error } = await this.supabase.storage
      .from('r3_buzinas')
      .list(path, {
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      throw new BadRequestException(`Error listing folders: ${error.message}`);
    }

    return data;
  }

  async uploadFile(path: string, fileContent: Buffer): Promise<any> {
    if (!path) {
      throw new BadRequestException('O parâmetro path é obrigatório');
    }

    const { data, error } = await this.supabase.storage
      .from('r3_buzinas')
      .upload(`${path}`, fileContent);

    if (error) {
      throw new BadRequestException(`Error uploading file: ${error.message}`);
    }

    const { publicUrl } = this.getPublicUrl(path);

    return {
      ...data,
      publicUrl,
    };
  }

  async downloadFile(publicUrl: string): Promise<Buffer> {
    if (!publicUrl) {
      throw new BadRequestException('O parâmetro publicUrl é obrigatório');
    }

    try {
      const response = await axios.get(publicUrl, {
        responseType: 'arraybuffer',
      });

      return Buffer.from(response.data);
    } catch (error) {
      throw new BadRequestException(`Error downloading file: ${error.message}`);
    }
  }

  getPublicUrl(path: string) {
    const { data } = this.supabase.storage
      .from('r3_buzinas')
      .getPublicUrl(path);

    return data;
  }
}
