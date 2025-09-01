import { PartialType } from '@nestjs/mapped-types';
import { CreateEventQuestionDto } from './create-event-question.dto';

export class UpdateEventQuestionDto extends PartialType(CreateEventQuestionDto) { } 