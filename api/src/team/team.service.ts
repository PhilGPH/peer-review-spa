import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '../models/entity/team.entity';
import { Invitation } from '../models/entity/invitation-team.entity';
import { Repository } from 'typeorm';
import { InvitationStatus } from '../models/common/invitation-status.enum';
import { User } from '../models/entity/user.entity';
import { TeamNotFoundException } from '../common/exceptions/team/team-not-found.exception';
import { TeamNameTakenException } from '../common/exceptions/team/team-name-taken.exception';
import { UserNotFoundException } from '../common/exceptions/user/user-not-found.exception';
import { InvitationNotFoundException } from '../common/exceptions/invitation/invitation-not-found.exception';
import { AlreadyInTeamException } from '../common/exceptions/team/already-in-team.exception';
import { UserNotOwningInvitationException } from '../common/exceptions/user/user-not-owning-invitation.exception';
import { StatusReview } from '../models/common/status-review.enum';
import { NotInTeamException } from '../common/exceptions/team/not-in-team.exception';
import { WorkItem } from '../models/entity/work-item.entity';
import { ReviewWorkItem } from '../models/entity/review-work-item.entity';
import { plainToClass } from 'class-transformer';
import { ShowTeamDTO } from '../models/dto/team/show-team.dto';
import { UserDto } from '../models/dto/user/user.dto';

@Injectable()
export class TeamService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    @InjectRepository(Invitation) private readonly invitationRepository: Repository<Invitation>,
    @InjectRepository(WorkItem) private readonly workItemRepo: Repository<WorkItem>,
    @InjectRepository(ReviewWorkItem) private readonly reviewWorkItemRepo: Repository<ReviewWorkItem>
  ) {}

  public async getTeam(idTeam: string) {

    const foundTeam = await this.teamRepository.findOne({
      where: { id: idTeam },
      relations: ['invitations','invitations.user']
    });

    if (!foundTeam) {
      throw new TeamNotFoundException("No such team was found")
    }

    const invitations = [];

    for (const invitation of await foundTeam.invitations) {
      const { id, status } = invitation;
      const user = await invitation.user;

      invitations.push({id, status, user: plainToClass(UserDto, user, {excludeExtraneousValues: true})});
    }
    const { id, name } = foundTeam;
    
    return { id, name, invitations };
  }

  public async createTeam(newTeam, user) {

    const teamName = await this.teamRepository.findOne({ where: { name: newTeam.name }});
    
    if (teamName) {
      throw new TeamNameTakenException("Team with the same name already exists")
    }

    const savedTeam = await this.teamRepository.save(newTeam);
    
    const newInvitation = new Invitation();

    newInvitation.user = user;
    newInvitation.status = InvitationStatus.ACCEPTED;
    newInvitation.team = savedTeam;    
  
    await this.invitationRepository.save(newInvitation)

    return savedTeam;
  }

  // get invitations a user has
  public async getAllInvitations(user: User) {
    const invitations = await this.invitationRepository.find({
      where: { user },
      relations: ['team']
    }); 
    const invitationsArr = [];
    for (const invitation of invitations) {
      const {status, id } = invitation;

      invitationsArr.push({status, id, team:await invitation.team});
    }

    return invitations;
  }

  public async getAllTeams(user: User): Promise<ShowTeamDTO[]> {
    const status = InvitationStatus.ACCEPTED;
    const invitations = await this.invitationRepository.find({
      where: { user, status },
      relations: ['team'],
    });
    const teams = [];

    for (const invitation of invitations) {
      teams.push(await invitation.team);
    }

    return plainToClass(ShowTeamDTO, teams, {excludeExtraneousValues: true});
  }

  // send invitation for a team
  public async sendInvitation(id: string, username: string, userLogged: User) {
    const foundUser = await this.userRepository.findOne({where: { username }});

    if (!foundUser) {
      throw new UserNotFoundException("User with this username does not exist")
    }

    const foundTeam = await this.teamRepository.findOne({
      where: { id },
      relations: ['invitations','invitations.user']
    });

    if (!foundTeam) {
      throw new TeamNotFoundException("No such team was found")
    }

    const loggedUserInTeam = await this.invitationRepository.findOne({
      where: {
        user: userLogged,
        ream: foundTeam,
        status: StatusReview.ACCEPTED
      }
    });

    if(!loggedUserInTeam) {
      throw new NotInTeamException("This user is not part of the team and can't invite other users!");
    }

    const isInTeam = await this.invitationRepository.findOne({
      where: {
        user: foundUser,
        team: foundTeam
      },

    });

    if (isInTeam) {
      throw new AlreadyInTeamException("This user is already invited!")
    }

    const newInvitation = new Invitation();

    newInvitation.user = Promise.resolve(foundUser);
    newInvitation.team = Promise.resolve(foundTeam);
    newInvitation.status = InvitationStatus.PENDING;

    return await this.invitationRepository.save(newInvitation);
  }

  public async updateInvitation(id: string, user: User, status) {

    const foundInvitation = await this.invitationRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!foundInvitation) {
      throw new InvitationNotFoundException("No such invitation exists")
    }

    const ownerInvitation = await foundInvitation.user;
    if (ownerInvitation.id !== user.id) {
      throw new UserNotOwningInvitationException("You are not the owner of this invitation")
    }

    foundInvitation.status = status.status;

    const savedInvitaion = await this.invitationRepository.save(foundInvitation);
    await savedInvitaion.team;

    return savedInvitaion;
  }

  public async getTeamWorkItems(idTeam: string) {
    const team = await this.getTeam(idTeam);
    const partOfTeam = await this.invitationRepository.find({
      where: {
        team: team,
        status: InvitationStatus.ACCEPTED
      },
      relations: ['user']
    });
    const users = [];

    for (const invitation of partOfTeam) {
      users.push({assignee: await invitation.user});
    };

    const workItems = await this.workItemRepo.find({
      where: users,
      relations: ['assignee']
    });

    return { workItems };
  }

  public async getTeamReviews(idTeam: string) {
    const team = await this.getTeam(idTeam);
    const partOfTeam = await this.invitationRepository.find({
      where: {
        team: team,
        status: InvitationStatus.ACCEPTED
      },
      relations: ['user']
    });
    const users = [];

    for (const invitation of partOfTeam) {
      users.push({reviewer: await invitation.user});
    };

    const workItems = [];
    const reviews = await this.reviewWorkItemRepo.find({
      where: users,
      relations: ['workItem', 'workItem.assignee']
    });
    
    for (const review of reviews) {
      workItems.push(await review.workItem);
    }

    return { workItems };
  }
}
