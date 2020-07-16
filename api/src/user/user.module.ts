import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from '../models/entity/team.entity';
import { Invitation } from '../models/entity/invitation-team.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from '../models/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Team, Invitation]),
    AuthModule,
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
