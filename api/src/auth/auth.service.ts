import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDTO } from '../models/dto/user/user-login-dto';
import { JwtPayload } from '../core/interfaces/jwt-payload';
import { User } from '../models/entity/user.entity';
import { UserService } from '../user/user.service';
import { UserNotFoundException } from '../common/exceptions/user/user-not-found.exception';
import { PasswordMatchException } from '../common/exceptions/user/password-match.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(userData: UserLoginDTO): Promise<{ user: User, token: string }> {
    const { username } = userData;
    const user = await this.userService.signIn(username);
    if (!user) {
      throw new UserNotFoundException(`No such user`);
    }
    const isPasswordValid = await this.userService.validatePassword(userData);
    if (!isPasswordValid) {
      throw new PasswordMatchException(`Password doesn't match`);
    }
    const userPayload: JwtPayload = { username: user.username, role: user.role };
    const token = await this.jwtService.sign(userPayload);
    return {user, token};
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    return await this.userService.validate(payload);
  }
}
