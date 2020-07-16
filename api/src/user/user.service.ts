import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/entity/user.entity';
import { UserRegisterDTO } from '../models/dto/user/user-register-dto';
import { UserDto } from '../models/dto/user/user.dto';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../core/interfaces/jwt-payload';
import { UserLoginDTO } from '../models/dto/user/user-login-dto';
import { UserNotFoundException } from '../common/exceptions/user/user-not-found.exception';
import { UserAlreadyExistException } from '../common/exceptions/user/user-already-exist.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async signIn(username: string): Promise<User> {

    const user = await this.userRepo.findOne({
      where: {
        username,
        isDeleted: false,
      },
    });

    if (!user) {
      throw new UserNotFoundException('User with such username doesnt exist!', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async register(userData: UserRegisterDTO): Promise<UserDto> {

    const userByUsername = await this.userRepo.findOne({
      where: { username: userData.username },
    });
    const userByEmail = await this.userRepo.findOne({
      where: { email: userData.email },
    });

    if (!!userByUsername || !!userByEmail) {
      const check = !!userByUsername ? 'username' : 'email';

      throw new UserAlreadyExistException(`This ${check} is already taken!`);
    }

    const passwordHash = await bcrypt.hash(userData.password, 10);
    const savedUser = await this.userRepo.save({
      ...userData,
      password: passwordHash,
    });

    return plainToClass(UserDto, savedUser, { excludeExtraneousValues: true });
  }

  async logout(userId: string): Promise<UserDto> {

    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UserNotFoundException('User with such username doesnt exist!', HttpStatus.BAD_REQUEST);
    }

    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  async validate(payload: JwtPayload): Promise<User | undefined> {
    return await this.userRepo.findOne({
      where: {
        ...payload,
      },
    });
  }

  async findUserByUsername(username: string): Promise<UserDto> {
    const user = await this.userRepo.findOne({
      where: { username }
    })

    return user;
  }

  async findAllUsers(): Promise<UserDto[]> {
    const allUsers = await this.userRepo.find({
      order: { username: 'ASC' }
    })
    
    return allUsers.map(user => plainToClass(UserDto, user, { excludeExtraneousValues: true }))
  }

  async validatePassword(user: UserLoginDTO): Promise<boolean> {
    const userEntity = await this.userRepo.findOne({
      where: {
        username: user.username,
        isDeleted: false,
      },
    });

    return await bcrypt.compare(user.password, userEntity.password);
  }
}
