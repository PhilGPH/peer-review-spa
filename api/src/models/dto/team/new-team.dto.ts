import { IsNotEmpty, IsString, Length } from "class-validator";

export class NewTeamDTO {
  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  name: string;
}
