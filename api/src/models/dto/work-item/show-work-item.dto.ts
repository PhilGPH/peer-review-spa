import { Expose } from "class-transformer";
import { TagWorkItem } from "../../common/tag-work-item.enum";
import { StatusWorkItem } from "../../common/status-work-item.enum";

export class ShowWorkItemDTO {
    @Expose()
    id: string;
    @Expose()
    title: string;
    @Expose()
    description: string;
    @Expose()
    tag: TagWorkItem;
    @Expose()
    create: Date;
    @Expose()
    status: StatusWorkItem;
}
