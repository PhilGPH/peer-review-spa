import { User } from './user';

export interface Review {
  id: string;
  status: string;
  __reviewer__: User;
}
