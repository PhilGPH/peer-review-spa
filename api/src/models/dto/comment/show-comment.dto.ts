import { Expose } from 'class-transformer';

export class ShowCommentDTO {
  @Expose()
  id: string;
  
  @Expose()
  content: string;

  @Expose()
  created: Date;
}
