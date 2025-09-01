import { PartialType } from '@nestjs/mapped-types';
import { CreateEventCouponDto } from './create-event-coupon.dto';

export class UpdateEventCouponDto extends PartialType(CreateEventCouponDto) { } 