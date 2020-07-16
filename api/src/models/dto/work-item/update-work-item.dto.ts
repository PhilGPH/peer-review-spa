import { StatusWorkItem } from "../../common/status-work-item.enum";

export class UpdateWorkItemDTO {
    title?: string;
    description?: string;
    review?: string[];
    status?: StatusWorkItem;
}
