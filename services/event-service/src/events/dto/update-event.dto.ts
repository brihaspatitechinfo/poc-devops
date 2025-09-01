import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsEmail, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { EventPriceDto } from './event-price.dto';
import { EventQuestionDto } from './event-question.dto';
import { EventSearchTagDto } from './event-search-tag.dto';
import { EventSpeakerDto } from './event-speaker.dto';

export class UpdateEventDto {
  @ApiProperty({
    example: 'React Masterclass Workshop',
    description: 'Event title',
    type: 'string'
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'React Masterclass Workshop - Advanced Concepts',
    description: 'Meta title for SEO',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiProperty({
    example: 'event-123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique event GUID',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  eventGuid?: string;

  @ApiProperty({
    example: 'https://example.com/events/react-masterclass',
    description: 'Event URL',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({
    example: 'Advanced React concepts including hooks, context, and performance optimization.',
    description: 'Short description of the event',
    type: 'string'
  })
  @IsString()
  shortDescription: string;

  @ApiProperty({
    example: 'Learn advanced React concepts from industry experts',
    description: 'Meta description for SEO',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({
    enum: [0, 1, 2],
    example: 0,
    description: 'Event type: 0=>Virtual, 1=> offline, 2=>others',
    type: 'number'
  })
  @IsEnum([0, 1, 2])
  type: number;

  @ApiProperty({
    example: 75,
    description: 'Timezone ID',
    type: 'number'
  })
  @IsNumber()
  timezoneId: number;

  @ApiProperty({
    example: '2024-03-01T09:00:00Z',
    description: 'Event start date and time (ISO 8601 format)',
    type: 'string'
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: '2024-03-01T17:00:00Z',
    description: 'Event end date and time (ISO 8601 format)',
    type: 'string'
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    example: '+91-9876543210',
    description: 'Contact number',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the event is paid',
    required: false,
    type: 'boolean'
  })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether the event is featured',
    required: false,
    type: 'boolean'
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({
    example: 999.99,
    description: 'Event price',
    required: false,
    type: 'number'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventPriceDto)
  price?: EventPriceDto[];

  @ApiProperty({
    example: 'INR',
    description: 'Currency for the event price',
    type: 'string'
  })
  @IsString()
  currency: string;

  @ApiProperty({
    example: false,
    description: 'If enabled contact and email will be hidden',
    type: 'boolean'
  })
  @IsBoolean()
  isRedact: boolean;

  @ApiProperty({
    example: 91,
    description: 'Dial code ID',
    required: false,
    type: 'number'
  })
  @IsOptional()
  @IsNumber()
  dialCodeId?: number;

  @ApiProperty({
    example: 'organizer@example.com',
    description: 'Event organizer email',
    type: 'string'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123 Main Street, City, State 12345',
    description: 'Event address',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'Advanced React concepts including hooks, context, and performance optimization. Learn from industry experts and get hands-on experience with real-world projects.',
    description: 'Detailed description of the event',
    type: 'string'
  })
  @IsString()
  detailedDescription: string;

  @ApiProperty({
    example: 'https://example.com/images/event-banner.jpg',
    description: 'Event list image URL',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  listImage?: string;

  @ApiProperty({
    example: 'https://zoom.us/j/123456789?pwd=abc123',
    description: 'Live event URL',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  liveEventUrl?: string;

  @ApiProperty({
    example: 'https://example.com/recordings/event-recording.mp4',
    description: 'Event recording URL',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  recordingUrl?: string;

  @ApiProperty({
    example: 'Please answer a few questions to complete your registration',
    description: 'Questionnaire label',
    type: 'string'
  })
  @IsString()
  questionnaireLabel: string;

  @ApiProperty({
    example: false,
    description: 'Whether the event is marquee',
    required: false,
    type: 'boolean'
  })
  @IsOptional()
  @IsBoolean()
  isMarquee?: boolean;

  @ApiProperty({
    example: 'featured',
    description: 'Marquee view type',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  marqueeView?: string;

  @ApiProperty({
    example: 'https://example.com/events/react-masterclass/details',
    description: 'Detail URL',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  detailUrl?: string;

  @ApiProperty({
    example: 'Contribute to the community',
    description: 'Contribution label',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  contributionLabel?: string;

  @ApiProperty({
    example: 'https://example.com/images/event-image.jpg',
    description: 'Event image URL',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  eventImage?: string;

  @ApiProperty({
    example: '1',
    description: 'Event category ID',
    required: false,
    type: 'number'
  })
  @IsOptional()
  @IsArray()
  category?: number[];

  @ApiProperty({
    example: ['https://example.com/images/event-photo-1.jpg', 'https://example.com/images/event-photo-2.jpg'],
    description: 'Event photos',
    required: false,
    type: 'string[]'
  })
  @IsOptional()
  @IsArray()
  photoGallery?: string[];

  @ApiProperty({
    example: 101,
    description: 'Event country ID',
    required: false,
    type: 'number'
  })
  @IsOptional()
  @IsNumber()
  countryId?: number;

  @ApiProperty({
    example: 13,
    description: 'Event state ID',
    required: false,
    type: 'number'
  })
  @IsOptional()
  @IsNumber()
  stateId?: number;

  @ApiProperty({
    example: 13,
    description: 'Event city ID',
    required: false,
    type: 'number'
  })
  @IsOptional()
  @IsNumber()
  cityId?: number;

  @ApiProperty({
    example: 'https://example.com/questionnaire/event-questionnaire.pdf',
    description: 'Questionnaire URL',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventQuestionDto)
  questionnaire?: EventQuestionDto[];

  @ApiProperty({
    example: 'https://example.com/speakers/speaker-1.jpg',
    description: 'Speaker image URL',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventSpeakerDto)
  speakers?: EventSpeakerDto[];

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Search tags',
    required: false,
    type: 'number[]'
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventSearchTagDto)
  searchTags?: EventSearchTagDto[];

  @ApiProperty({
    example: 'user-123',
    description: 'User ID who created the event',
    required: false,
    type: 'string'
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
