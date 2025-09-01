import { PartialType } from '@nestjs/mapped-types';
import { CreateEventPriceDto } from './create-event-price.dto';

export class UpdateEventPriceDto extends PartialType(CreateEventPriceDto) { } 