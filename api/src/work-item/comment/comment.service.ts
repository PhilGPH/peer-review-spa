import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkItem } from '../../models/entity/work-item.entity';
import { Repository } from 'typeorm';
import { Comment } from '../../models/entity/comment.entity';
import { WorkItemNotFoundException } from '../../common/exceptions/work-item/work-item-not-found.exception';
import { CommonService } from '../../common/common.service';
import { NotAllowedException } from '../../common/exceptions/common/not-allowed.exception';
import { UserRoleType } from '../../models/common/user-role.enum';
import { CommentNotFoundException } from '../../common/exceptions/comment/comment-not-found.exception';

@Injectable()
export class CommentService {

  constructor(
    private readonly commonService: CommonService,
    @InjectRepository(WorkItem) private readonly workItemRepo: Repository<WorkItem>,
    @InjectRepository(Comment) private readonly commentRepo: Repository<Comment>,
  ) {}

  // Create a comment
  async create(commentBody, id, user) {
    const foundPost = await this.workItemRepo.findOne({where: { id }});

    if(!foundPost) {
      throw new WorkItemNotFoundException(`Work item with id: ${id}, couldn't be found!`);
    }

    const newComment = new Comment();
    newComment.author = Promise.resolve(user);
    newComment.content = commentBody.content;
    newComment.post = Promise.resolve(foundPost);

    const savedComment = await this.commentRepo.save(newComment);
    return this.commonService.converComment(savedComment);
  }

  // Edit a comment
  async edit(commentBody, id, user) {
    const foundComment = await this.commentRepo.findOne({where: { id }});
    
    if(!foundComment) {
      throw new CommentNotFoundException(`Comment with id: ${id}, couldn't be found!`);
    }
    
    const author = await foundComment.author;

    if(author.id !== user.id && user.role !== UserRoleType.ADMIN) {
      throw new NotAllowedException('User is not an author of this comment!');
    }


    foundComment.content = commentBody.content;

    const savedComment = await this.commentRepo.save(foundComment);
    
    return this.commonService.converComment(savedComment);
  }

  // Delete a comment
  async delete(id, user) {
    const foundComment = await this.commentRepo.findOne({where: { id }});

    if(!foundComment) {
      throw new CommentNotFoundException(`Comment with id: ${id}, couldn't be found!`);
    }

    const author = await foundComment.author;

    if(author.id !== user.id && user.role !== UserRoleType.ADMIN) {
      throw new NotAllowedException('User is not an author of this comment!');
    }

    foundComment.isDeleted = true;

    const savedComment = await this.commentRepo.save(foundComment);
    
    return this.commonService.converComment(savedComment);
  }
}
