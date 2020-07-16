import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;
  @Expose()
  username: string;
  @Expose()
  email: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  joined: Date;
  @Expose()
  role: string;
}
