import { PartialType } from '@nestjs/swagger';
import { CreateTimezoneMetaDto } from './create-timezone-meta.dto';

export class UpdateTimezoneMetaDto extends PartialType(CreateTimezoneMetaDto) { } 