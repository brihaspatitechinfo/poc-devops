import { ApiProperty } from '@nestjs/swagger';

export class UserSettingResponseDto {
    @ApiProperty({ description: 'User Setting ID' })
    _id: string;

    @ApiProperty({ description: 'User ID' })
    userId: string;

    @ApiProperty({ description: 'IP Address', required: false })
    ipaddress?: string;

    @ApiProperty({ description: 'Country ID', required: false })
    countryId?: number;

    @ApiProperty({ description: 'Currency ID', required: false })
    currencyId?: number;

    @ApiProperty({ description: 'Timezone ID', required: false })
    timezoneId?: number;

    @ApiProperty({ description: 'Is Active' })
    isActive: boolean;

    @ApiProperty({ description: 'Created At' })
    createdAt: Date;

    @ApiProperty({ description: 'Updated At' })
    updatedAt: Date;
} 