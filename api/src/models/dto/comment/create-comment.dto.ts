import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreateCommentDTO {

    @IsString()
    @IsNotEmpty()
    content: string;
}
