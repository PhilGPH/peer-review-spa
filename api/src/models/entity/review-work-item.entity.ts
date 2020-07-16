import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from "typeorm";
import { StatusReview } from "../common/status-review.enum";
import { WorkItem } from "./work-item.entity";
import { User } from "./user.entity";

@Entity('reviewWorkItems')
export class ReviewWorkItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({
    type: 'enum',
    enum: StatusReview,
    default: StatusReview.PENDING
  })
  status: StatusReview;

  @ManyToOne(type => WorkItem, workItem => workItem.review)
  workItem: Promise<WorkItem>

  @ManyToOne(type => User, user => user.reviews)
  reviewer:Promise<User> 
}