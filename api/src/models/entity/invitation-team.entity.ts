import { Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne, Column } from "typeorm";
import { User } from "./user.entity";
import { Team } from "./team.entity";
import { InvitationStatus } from "../common/invitation-status.enum";

@Entity('invitations')
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @ManyToOne(type => User, user => user.invitations)
  user: Promise<User>;

  @ManyToOne(type => Team, team => team.invitations)
  team: Promise<Team>;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING
  })
  status: InvitationStatus;
}