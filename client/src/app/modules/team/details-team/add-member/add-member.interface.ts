import { User } from 'src/app/data/schema/user';

export interface AddMemberData {
  allUsers: User[];
  teamId: string;
}
