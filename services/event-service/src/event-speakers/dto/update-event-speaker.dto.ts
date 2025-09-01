import { PartialType } from '@nestjs/mapped-types';
import { CreateEventSpeakerDto } from './create-event-speaker.dto';

export class UpdateEventSpeakerDto extends PartialType(CreateEventSpeakerDto) { } 