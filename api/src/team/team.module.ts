import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/entity/user.entity';
import { Team } from '../models/entity/team.entity';
import { Invitation } from '../models/entity/invitation-team.entity';
import { AuthModule } from '../auth/auth.module';
import { WorkItem } from '../models/entity/work-item.entity';
import { ReviewWorkItem } from '../models/entity/review-work-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Team, Invitation, WorkItem, ReviewWorkItem]),
    AuthModule,
  ],
  
  controllers: [TeamController],
  providers: [TeamService]
})
export class TeamModule {}
