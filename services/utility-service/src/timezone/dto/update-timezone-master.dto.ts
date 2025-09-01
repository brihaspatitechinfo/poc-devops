import { PartialType } from '@nestjs/swagger';
import { CreateTimezoneMasterDto } from './create-timezone-master.dto';

export class UpdateTimezoneMasterDto extends PartialType(CreateTimezoneMasterDto) {} 