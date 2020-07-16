import { Module } from '@nestjs/common';
import { WorkItemController } from './work-item.controller';
import { WorkItemService } from './work-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../models/entity/user.entity';
import { WorkItem } from '../models/entity/work-item.entity';
import { ReviewWorkItem } from '../models/entity/review-work-item.entity';
import { CommentService } from './comment/comment.service';
import { CommonModule } from '../common/common.module';
import { Comment } from '../models/entity/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, WorkItem, ReviewWorkItem, Comment]),
    AuthModule,
    CommonModule,
  ],
  controllers: [WorkItemController],
  providers: [WorkItemService, CommentService]
})
export class WorkItemModule {}
