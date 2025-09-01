import { PartialType } from '@nestjs/swagger';
import { CreateLocationMasterDto } from './create-location-master.dto';

export class UpdateLocationMasterDto extends PartialType(CreateLocationMasterDto) {} 