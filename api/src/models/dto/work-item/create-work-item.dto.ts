import { IsString, Length, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { TagWorkItem } from '../../common/tag-work-item.enum';

export class CreateWorkItemDTO {
    @IsString()
    @Length(3, 100)
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    review: string[];

    @IsString()
    tag: TagWorkItem;
}
