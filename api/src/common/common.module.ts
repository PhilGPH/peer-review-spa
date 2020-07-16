import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from './common.service';
import { User } from '../models/entity/user.entity';
import { WorkItem } from '../models/entity/work-item.entity';
import { ReviewWorkItem } from '../models/entity/review-work-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, WorkItem, ReviewWorkItem]),
  ],
  providers: [CommonService],
  exports: [
    CommonService
  ]
})
export class CommonModule {}
