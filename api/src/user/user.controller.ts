import { Controller, UseFilters, Param, UseGuards, Get } from '@nestjs/common';
import { CustomExceptionFilter } from '../common/filters/custom-exception.filter';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/user')
@UseFilters(new CustomExceptionFilter())
export class UserController {

  constructor(
    private readonly userService: UserService
  ){}

  @UseGuards(AuthGuard())
  @Get(':username')
  async findUser(@Param('username') username: string) {
    return await this.userService.findUserByUsername(username);
  }

  // Get all users for the item creation process
  @UseGuards(AuthGuard())
  @Get()
  public async findAllUsers() {
    return await this.userService.findAllUsers();
  }
  
}
