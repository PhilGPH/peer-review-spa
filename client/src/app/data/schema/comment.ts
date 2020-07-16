import { User } from './user';

export interface Comment {
  content: string;
  created: Date;
  id: string;
  author: User;
  isDeleted: boolean;
}
