import { IsEnum } from "class-validator";
import { InvitationStatus } from "../../common/invitation-status.enum";

export class InvitationStatusDTO {
  @IsEnum(InvitationStatus)
  status: InvitationStatus;
}
