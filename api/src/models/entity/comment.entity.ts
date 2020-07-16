import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { WorkItem } from "./work-item.entity";

@Entity('comments')
export class Comment {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('nvarchar')
	content: string;

	@ManyToOne(type => User, user => user.comments)
	author: Promise<User>;

	@ManyToOne(type => WorkItem, workItem => workItem.comments)
	post: Promise<WorkItem>;

	@Column({default: false})
	isDeleted: boolean;

	@CreateDateColumn()
	created: Date;
}