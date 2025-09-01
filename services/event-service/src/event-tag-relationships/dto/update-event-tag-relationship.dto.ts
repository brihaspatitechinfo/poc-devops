import { PartialType } from '@nestjs/mapped-types';
import { CreateEventTagRelationshipDto } from './create-event-tag-relationship.dto';

export class UpdateEventTagRelationshipDto extends PartialType(CreateEventTagRelationshipDto) { } 