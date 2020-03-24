import {
    IsString,
    MinLength,
    MaxLength,
} from 'class-validator';
import { HandBookConstants } from '../../constants/handbook';

export class CreateHandBookDto {
    @MinLength(HandBookConstants.TITLE_MIN_LENGTH, {
        message: '小书标题不能为空',
    })
    @MaxLength(HandBookConstants.TITLE_MAX_LENGTH, {
        message: '小书标题不能超过 $constraint1 个字符',
    })
    @IsString({
        message: '小书标题不能为空',
    })
    readonly name: string;
}