import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToMany
} from 'typeorm';
import { UserRoleType } from '../common/user-role.enum';
import { Invitation } from './invitation-team.entity';
import { Comment } from './comment.entity';
import { WorkItem } from './work-item.entity';
import { ReviewWorkItem } from './review-work-item.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
	firstName: string;

	@Column({ length: 50 })
	lastName: string;

	@Column({ length: 15, unique: true })
	username: string;

	@Column('nvarchar')
	password: string;

	@Column({ unique: true })
	email: string;

	@Column({ default: false })
	isDeleted: boolean;

  @Column({
    type: 'enum',
    enum: UserRoleType,
    default: UserRoleType.USER
  })
  role: UserRoleType;

  @OneToMany(type => Invitation, invitation => invitation.user)
  invitations: Promise<Invitation[]>

  @OneToMany(type => WorkItem, workItem => workItem.assignee)
  workItems: Promise<WorkItem[]>

  @OneToMany(type => ReviewWorkItem, reviewWorkItem => reviewWorkItem.reviewer)
  reviews: Promise<ReviewWorkItem[]>

  @OneToMany(type => Comment, comment => comment.author)
  comments: Promise<Comment[]>;

  @CreateDateColumn()
  joined: Date;
}
