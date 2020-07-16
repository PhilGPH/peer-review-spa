import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkItem } from '../models/entity/work-item.entity';
import { Repository } from 'typeorm';
import { ReviewWorkItem } from '../models/entity/review-work-item.entity';
import { User } from '../models/entity/user.entity';
import { UserNotFoundException } from './exceptions/user/user-not-found.exception';
import { plainToClass } from 'class-transformer';
import { UserDto } from '../models/dto/user/user.dto';
import { WorkItemNotFoundException } from './exceptions/work-item/work-item-not-found.exception';

@Injectable()
export class CommonService {

  constructor(
    @InjectRepository(WorkItem) private readonly workItemRepo: Repository<WorkItem>,
    @InjectRepository(ReviewWorkItem) private readonly reviewWorkItemRepo: Repository<ReviewWorkItem>,
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {

  }

  async findWorkItemById(id: string): Promise<WorkItem> {
    const found = await this.workItemRepo.findOne({
      where: { id },
      relations: ['assignee', 'review', 'review.reviewer', 'comments', 'comments.author']
    });

    if(!found) {
      throw new WorkItemNotFoundException(`Work item with id: ${id}, cant be found!`);
    }

    return found;
  }

  public async getUsersFromArrIds(arrId: string[]) {
    const idsUsers = arrId.map((el) =>{
      return {id: el};
    });
    const reviewers = await this.userRepo.find({where: idsUsers})

    if(reviewers.length !== idsUsers.length) {
      throw new UserNotFoundException("Some of the reviewers couldn't be found!")
    }

    return reviewers;
  } 

  public async checkAssignee(workItem, user) {
    const assignee = await workItem.assignee;

    if(assignee.id !== user.id) {
      return false;
    }

    return true;
  }

  public async checkReviewer(workItem, user) {
    const reviews = await workItem.review;

    for(let i = 0; i < reviews.length; i += 1) {
      const reviewer = await reviews[i].reviewer;

      if(reviewer.id === user.id) {
        return true;
      }
    }

    return false;
  }

  public async converComment(comment) {
    comment.author = plainToClass(UserDto, await comment.author, {excludeExtraneousValues: true});

    return comment;
  }

  public async convertWorkItem(workItem, reviews = []) {
    let { id, title, status, description, assignee, review, isMerged, comments, tag, created } = workItem;
    const newWorkItemObj = { id, title, description, status, isMerged, tag, created };

    assignee = await assignee;
    review = await review;
    comments = await comments;
    
    newWorkItemObj['assignee'] = plainToClass(UserDto, assignee, {excludeExtraneousValues: true});
    newWorkItemObj['review'] = [];
    newWorkItemObj['comments'] = [];

    if(reviews.length === 0 && review && review.length > 0) {

      for(const reviewEl of review) {
        const resolvedReview = await reviewEl;
        const resolvedReviewer = await resolvedReview.reviewer;

        resolvedReview.reviewer = plainToClass(UserDto, resolvedReviewer, {excludeExtraneousValues: true});
        newWorkItemObj['review'].push(resolvedReview);
      };
    }

    for(const reviewEl of reviews){
      const resolvedReviewer = await reviewEl.reviewer;

      reviewEl.reviewer = plainToClass(UserDto, resolvedReviewer, {excludeExtraneousValues: true});
      newWorkItemObj['review'].push(reviewEl);
    };

    for(const commentEl of comments) {
      const resolvedCommentAuthor = await commentEl.author;
      
      commentEl.author = plainToClass(UserDto, resolvedCommentAuthor, {excludeExtraneousValues: true});
      newWorkItemObj['comments'].push(commentEl);
    };

    return newWorkItemObj;
  }
}
