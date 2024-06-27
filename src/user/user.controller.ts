import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserId } from '../decorators/user-id.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@UserId() userId: string, @Body() dto: UpdateUserDto) {
    return await this.usersService.update(userId, dto);
  }
}
