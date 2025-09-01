import { PartialType } from '@nestjs/mapped-types';
import { CreateEventQuestionAnswerDto } from './create-event-question-answer.dto';

export class UpdateEventQuestionAnswerDto extends PartialType(CreateEventQuestionAnswerDto) { } 