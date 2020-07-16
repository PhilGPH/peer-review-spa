import { AuthUser } from './../common/decorators/user.decorator';
import { UserDto } from './../models/dto/user/user.dto';
import { Controller, Post, Body, ValidationPipe, BadRequestException, UseFilters, UseGuards, UnsupportedMediaTypeException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDTO } from '../models/dto/user/user-login-dto';
import { UserRegisterDTO } from '../models/dto/user/user-register-dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../models/entity/user.entity';
import { UserService } from '../user/user.service';
import { CustomExceptionFilter } from '../common/filters/custom-exception.filter';

@UseFilters(new CustomExceptionFilter())
@Controller('/api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body(new ValidationPipe({
    transform: true,
    whitelist: true,
  })) userData: UserRegisterDTO): Promise<UserDto> {
    return await this.userService.register(userData);
  }

  @Post('login')
  async login(@Body(new ValidationPipe({
    transform: true,
    whitelist: true,
  })) userData: UserLoginDTO): Promise<{ user: User, token: string }> {

    const authObject = await this.authService.signIn(userData);
    if (!authObject) {
      throw new BadRequestException(`Wrong credentials!`);
    }

    return authObject;
  }

  @UseGuards(AuthGuard())
  @Post('logout')
  logout(@AuthUser('id') userId: string): Promise<UserDto> {
    return this.userService.logout(userId);
  }
}
