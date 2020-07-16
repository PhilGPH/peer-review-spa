import { User } from './user';
import { Team } from './team';

export interface Invitation {
  id: string;
  user: User;
  team: Team;
  status: string;
}
