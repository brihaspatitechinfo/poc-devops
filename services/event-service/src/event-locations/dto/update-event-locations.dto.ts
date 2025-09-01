import { PartialType } from '@nestjs/swagger';
import { CreateEventLocationsDto } from './create-event-locations.dto';

export class UpdateEventLocationsDto extends PartialType(CreateEventLocationsDto) { } 