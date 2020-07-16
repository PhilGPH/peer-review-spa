import { Invitation } from './invitation';

export interface Team {
  id?: string;
  name: string;
  invitations?: Invitation[];
}
