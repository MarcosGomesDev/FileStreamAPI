import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'This is a FileStream API built with NestJS!',
    };
  }
}
