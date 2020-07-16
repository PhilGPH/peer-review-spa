import { Controller, Post, HttpCode, HttpStatus, UseGuards, Body, ValidationPipe, Get, Param, Query, Put, UseFilters } from '@nestjs/common';
import { TeamService } from './team.service';
import { AuthGuard } from '@nestjs/passport';
import { NewTeamDTO } from '../models/dto/team/new-team.dto';
import { User } from '../models/entity/user.entity';
import { AuthUser } from '../common/decorators/user.decorator';
import { InvitationStatusDTO } from '../models/dto/team/invitation-status.dto';
import { CustomExceptionFilter } from '../common/filters/custom-exception.filter';
import { ShowTeamDTO } from '../models/dto/team/show-team.dto';

@Controller('/api/team')
@UseFilters(new CustomExceptionFilter())
export class TeamController {

  constructor(
    private readonly teamService: TeamService
  ) {}

  // Get user's invitations
  @UseGuards(AuthGuard())
  @Get('/invitations')
  public async getInvitations(
    @AuthUser() user: User,
  ) {
    return await this.teamService.getAllInvitations(user);
  }

  @UseGuards(AuthGuard())
  @Get('/all')
  public async getAllTeams(
    @AuthUser() user: User,
  ): Promise<ShowTeamDTO[]> {
    return await this.teamService.getAllTeams(user);
  }

  // Create a team
  @Post()
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  public async createTeam(
    @Body(new ValidationPipe({
      transform: true,
      whitelist: true
    })) newTeam: NewTeamDTO, @AuthUser() user: User) {
    return await this.teamService.createTeam(newTeam, user);
  }

  // Accept/decline an invitation
  @UseGuards(AuthGuard())
  @Put('/invitation/:id')
  public async updateStatusInvitation(
    @Param('id') id: string,
    @AuthUser() user: User,
    @Body(new ValidationPipe({
      transform: true,
      whitelist: true
    })) status: InvitationStatusDTO
  ) {
    return await this.teamService.updateInvitation(id, user, status);
  }

  // Get specific team
  @Get(':id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  public async getTeam(@Param('id') id: string) {
    return await this.teamService.getTeam(id);
  }

  // get all work items in a team
  @Get(':id/workItems')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  public async getTeamWorkItems(@Param('id') id: string) {
    return await this.teamService.getTeamWorkItems(id);
  }

  // get all reviews in a team
  @Get(':id/reviews')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  public async getTeamReviews(@Param('id') id: string) {
    return await this.teamService.getTeamReviews(id);
  }

  // Invite a user by username
  @UseGuards(AuthGuard())
  @Post(':id/invite')
  public async sendInvitation(
    @Param('id') idTeam: string,
    @Query('username') username: string,
    @AuthUser() user: User
  ) {
    return await this.teamService.sendInvitation(idTeam, username, user);
  }
}
