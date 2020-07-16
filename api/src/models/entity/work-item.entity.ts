import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn } from "typeorm";
import { Comment } from "./comment.entity";
import { User } from "./user.entity";
import { ReviewWorkItem } from "./review-work-item.entity";
import { StatusWorkItem } from "../common/status-work-item.enum";
import { TagWorkItem } from "../common/tag-work-item.enum";

@Entity('workItems')
export class WorkItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column('longtext')
  description: string;

  @Column({
    type: 'enum',
    enum: StatusWorkItem,
    default: StatusWorkItem.PENDING
  })
  status: StatusWorkItem;
  
  @Column({ default: false })
  isMerged: boolean;

  @Column({
    type: 'enum',
    enum: TagWorkItem
  })
  tag: TagWorkItem;

  @ManyToOne(type => User, user => user.workItems)
  assignee: Promise<User>

  @OneToMany(type => ReviewWorkItem, reviewWorkItem => reviewWorkItem.workItem)
  review: Promise<ReviewWorkItem[]>

  @OneToMany(type => Comment, comment => comment.post)
  comments: Promise<Comment[]>

  @CreateDateColumn()
	created: Date;
}