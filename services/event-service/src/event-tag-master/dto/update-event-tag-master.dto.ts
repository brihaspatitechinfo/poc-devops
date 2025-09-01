import { PartialType } from '@nestjs/swagger';
import { CreateEventTagMasterDto } from './create-event-tag-master.dto';

export class UpdateEventTagMasterDto extends PartialType(CreateEventTagMasterDto) { } 