import { Injectable } from '@nestjs/common';
import { CreateWorkItemDTO } from '../models/dto/work-item/create-work-item.dto';
import { User } from '../models/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkItem } from '../models/entity/work-item.entity';
import { Repository, Index } from 'typeorm';
import { ReviewWorkItem } from '../models/entity/review-work-item.entity';
import { NotAllowedException } from '../common/exceptions/common/not-allowed.exception';
import { StatusWorkItem } from '../models/common/status-work-item.enum';
import { CommonService } from '../common/common.service';
import { plainToClass } from 'class-transformer';
import { ShowWorkItemDTO } from '../models/dto/work-item/show-work-item.dto';
import { CantReviewException } from '../common/exceptions/work-item/cant-review.exception';
import { UserDto } from '../models/dto/user/user.dto';
import { UserNotFoundException } from '../common/exceptions/user/user-not-found.exception';

@Injectable()
export class WorkItemService {

  constructor(
    private readonly commonService: CommonService,
    @InjectRepository(WorkItem) private readonly workItemRepo: Repository<WorkItem>,
    @InjectRepository(ReviewWorkItem) private readonly reviewWorkItemRepo: Repository<ReviewWorkItem>,
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {}
  
  public async getOwnWorkItems(user) {
    const workItemsFound = await this.workItemRepo.find({where:{
        assignee: user
      },
    });

    return plainToClass(ShowWorkItemDTO, workItemsFound, {excludeExtraneousValues: true});
  }

  public async getAllItems() {
    const items = this.workItemRepo.find({
      order: { created: 'DESC'}
    })

    return items;
  }

  public async getReviewingWorkItems(user) {

    const reviews = await this.reviewWorkItemRepo.find({
      where: {
        reviewer: user
      },
      relations: ['workItem']
    });
    const returnedWorkItems = []

    for (const reviewEl of reviews) {
      const workItem = await reviewEl.workItem;
      // await workItem.assignee;
      returnedWorkItems.push(workItem);
    }

    return plainToClass(ShowWorkItemDTO, returnedWorkItems, {excludeExtraneousValues: true});
    // return returnedWorkItems;
  }

  public async showSingle(id: string) {
    const found = await this.commonService.findWorkItemById(id);

    return this.commonService.convertWorkItem(found);
  }

  public async create(workItem: CreateWorkItemDTO, user: User) {
    const { title, description, tag, review} = workItem;
    // const titleCheck = await this.workItemRepo.findOne({ where: { title: workItem.title }});

    // if (titleCheck) {
    //   throw new BadRequestException("Item with the same title already exists")
    // }

    const newWorkItem = this.workItemRepo.create({title, description, tag });
    
    newWorkItem.assignee = Promise.resolve(user);

    if (review.includes(user.id)) {
      throw new CantReviewException("You cannot be a reviewer of your own item")
    }

    const savedWorkItem = await this.workItemRepo.save(newWorkItem);
    const reviewers = await this.commonService.getUsersFromArrIds(review);
    const reviewsArr = await reviewers.map(user => {
      const newReview = new ReviewWorkItem();

      newReview.reviewer = Promise.resolve(user);
      newReview.workItem = Promise.resolve(savedWorkItem);

      return newReview;
    });

    const savedReviews = await this.reviewWorkItemRepo.save(reviewsArr);

    return this.commonService.convertWorkItem(savedWorkItem, savedReviews);
  }
  
  public async updateWorkItem(body, id, user) {
    const workItem = await this.commonService.findWorkItemById(id);
    const checkAssignee = await this.commonService.checkAssignee(workItem, user);

    if (!checkAssignee && user.role !== 'admin') {
      throw new NotAllowedException('User is now allowed to edit the work item as not assigned!');
    } 

    for(let prop of Object.keys(body)) {
      if(prop === 'status' || prop === 'review') {
        continue;
      }

      workItem[prop] = body[prop];
    }

    workItem.status = StatusWorkItem.PENDING;
    workItem.isMerged = true;
    await this.workItemRepo.save(workItem);

    // if(body['review']) {
      
    //   const newReviews = [];
    //   let userIDs = [];
    //   let currentRev = await workItem.review;

    //   for (const item of currentRev) {
    //     const user = await item.reviewer
    //     userIDs.push(user.id)        
    //   }
      
    //   let revsToRemove = [];
    //   for (const id of userIDs) {
    //     if (body['review'].includes(id)) {
    //       body['review'].splice(body['review'].indexOf(id), 1)
    //     }
    //     else {
    //       for (const rev of currentRev) {
    //         const user = await rev.reviewer
    //         if (user.id === id){
    //           revsToRemove.push(rev);
    //         }
    //       }
    //     }
    //   }
      
    //   if (revsToRemove.length > 0) {
    //     await this.reviewWorkItemRepo.remove(revsToRemove);
    //   }
      
    //   let arrRev = [];
    //   if(body['review'].length > 0) {
        
    //     const newReviewers = await this.commonService.getUsersFromArrIds(body['review']);
  
    //     arrRev = await newReviewers.map(user => {
    //       const newReview = new ReviewWorkItem();
          
    //       newReview.reviewer = Promise.resolve(user);
    //       newReview.workItem = Promise.resolve(workItem);
          
    //       return newReview;
    //     });
    //   }
      
    //   const savedReviews = await this.reviewWorkItemRepo.save([...newReviews,...arrRev]);
      
    //   return await this.commonService.convertWorkItem(workItem, savedReviews);
    // }
    
    return await this.commonService.convertWorkItem(workItem);
  }
  
  public async review(body, id, user) {
    const workItem = await this.commonService.findWorkItemById(id);
    const checkReviewer = await this.commonService.checkReviewer(workItem, user);

    if(!checkReviewer) {
      throw new NotAllowedException('User is now allowed to change the status of the work item as not reviewer!')
    }

    const reviews = await workItem.review;
    let currentReview;

    for(let reviewEl of reviews) {
      const reviewer = await reviewEl.reviewer;
  
      if(reviewer.id === user.id) {
        currentReview = reviewEl;
      }
    }
    
    currentReview.status = body.status;
    await this.reviewWorkItemRepo.save(currentReview)

    if(body.status === 'accepted') {
      let allReviewsAccepted = true;

      for (const reviewEl of reviews) {
        if(reviewEl.status !==  'accepted') {
          allReviewsAccepted = false;
        }
      }

      if(allReviewsAccepted) {
        workItem.status = StatusWorkItem.ACCEPTED;
        await this.workItemRepo.save(workItem);
      }

      if(workItem.status === 'pending') {
        workItem.status = StatusWorkItem.UNDERREVIEW;
        await this.workItemRepo.save(workItem);
      }
    }

    if(body.status === 'under review') {
      if(workItem.status === 'pending') {
        workItem.status = StatusWorkItem.UNDERREVIEW;
        await this.workItemRepo.save(workItem);
      }
    }

    if(body.status === 'change requested' || body.status === 'rejected') {
      workItem.status = body.status;
      await this.workItemRepo.save(workItem);
    }

    return this.commonService.convertWorkItem(workItem, reviews);
  }

  // Delete
}

