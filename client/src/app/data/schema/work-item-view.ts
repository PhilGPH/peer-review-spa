import { Comment } from './comment';
import { Review } from './review';
import { User } from './user';

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  status: string;
  assignee: User;
  created: Date;
  isMerged: boolean;
  comments: Comment[];
  review?: Review[];
}
