import { Expose } from 'class-transformer';

export class ShowTeamDTO {
  @Expose()
  id: string;
  
  @Expose()
  name: string;
}
