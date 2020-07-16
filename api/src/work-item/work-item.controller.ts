import { Controller, Get, UseGuards, HttpCode, HttpStatus, Post, Body, ValidationPipe, Param, UseFilters, Put, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateWorkItemDTO } from '../models/dto/work-item/create-work-item.dto';
import { AuthUser } from '../common/decorators/user.decorator';
import { User } from '../models/entity/user.entity';
import { WorkItemService } from './work-item.service';
import { CustomExceptionFilter } from '../common/filters/custom-exception.filter';
import { UpdateWorkItemDTO } from '../models/dto/work-item/update-work-item.dto';
import { CreateCommentDTO } from '../models/dto/comment/create-comment.dto';
import { CommentService } from './comment/comment.service';

@Controller('/api/work-item')
@UseFilters(new CustomExceptionFilter())
export class WorkItemController {

  constructor(
    private readonly workItemService: WorkItemService,
    private readonly commentService: CommentService
  ) {}

  // Get user's own created work items 
  @Get('own')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  public async getOwnWorkItems(
    @AuthUser() user: User
  ) {
    return this.workItemService.getOwnWorkItems(user);
  }

  // Get user's work items that has to or has reviewed
  @Get('own/reviews')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  public async getOwnReviews(
    @AuthUser() user: User
  ) {
    return this.workItemService.getReviewingWorkItems(user);
  }
  
  // Get all workitems
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getAllItems() {
    return this.workItemService.getAllItems();
  }

  // Get a work item by id
  @Get('/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  public async getWorkItem(@Param('id') id: string) {
    return this.workItemService.showSingle(id);
  }
  
  // Create a work item
  @Post()
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  public async createWorkItem(
    @Body(
      new ValidationPipe({
      transform: true,
      whitelist: true
    })) workItem: CreateWorkItemDTO,
    @AuthUser() user: User
  ) {
    return this.workItemService.create(workItem, user);
  }

  // Update a work item
  @Put(':id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  // check why validation pipe doesnt work
  public async updateWorkItem(
    @Body(
    ) body: UpdateWorkItemDTO,
    @Param('id') id: string,
    @AuthUser() user: User
  ) {
    return this.workItemService.updateWorkItem(body, id, user);
  }

  // Update a review status of a work item 
  @Put('review/:idWorkItem')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  public async reviewWorkItem(
    @Body() body,
    @Param('idWorkItem') id: string,
    @AuthUser() user: User
  ) {
    return this.workItemService.review(body, id, user);
  }

  // Comment a work item
  @Post(':id/comment')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  public async commentWorkItem(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true
      })
    ) createComment: CreateCommentDTO,
    @Param('id') idPost: string,
    @AuthUser() user: User
  ) {
    return this.commentService.create(createComment, idPost, user);
  }

  // Edit a comment 
  @Put('comment/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  public async editComment(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true
      })
    ) createComment: CreateCommentDTO,
    @Param('id') idComment: string,
    @AuthUser() user: User
  ) {
    return this.commentService.edit(createComment, idComment, user);
  }
  // Detele a comment
  @Delete('comment/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  public async deleteComment(
    @Param('id') idComment: string,
    @AuthUser() user: User
  ) {
    return this.commentService.delete(idComment, user);
  }
}
