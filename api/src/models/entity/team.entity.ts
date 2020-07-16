import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { Invitation } from "./invitation-team.entity";

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string; 

  @Column({ length: 50 })
  name: string;

  @OneToMany(type => Invitation, invitation => invitation.team)
  invitations: Promise<Invitation[]>;
}