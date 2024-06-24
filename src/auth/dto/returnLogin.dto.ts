import { ReturnUserDto } from '../../user/dto/return-user.dto';

export interface ReturnLogin {
  user: ReturnUserDto;
  accessToken: string;
}
