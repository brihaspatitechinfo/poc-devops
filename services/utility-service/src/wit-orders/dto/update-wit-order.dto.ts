import { PartialType } from '@nestjs/swagger';
import { CreateWitOrderDto } from './create-wit-order.dto';

export class UpdateWitOrderDto extends PartialType(CreateWitOrderDto) { } 