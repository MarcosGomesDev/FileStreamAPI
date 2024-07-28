import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
  imports: [UserModule],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
