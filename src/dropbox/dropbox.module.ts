import { Module } from '@nestjs/common';
import { DropboxService } from './dropbox.service';
import { DropboxController } from './dropbox.controller';

@Module({
  controllers: [DropboxController],
  providers: [DropboxService],
})
export class DropboxModule {}
