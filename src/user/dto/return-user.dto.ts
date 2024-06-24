import { UserEntity } from '../entities/user.entity';

export class ReturnUserDto {
  id: string;
  name: string;
  email: string;

  constructor(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.name = userEntity.name;
    this.email = userEntity.email;
  }
}
