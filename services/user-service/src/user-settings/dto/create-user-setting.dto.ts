import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserSettingDto {
    @ApiProperty({ description: 'User ID', example: '507f1f77bcf86cd799439011' })
    @IsMongoId()
    userId: string;

    @ApiProperty({ description: 'IP Address', example: '192.168.1.1', required: false })
    @IsOptional()
    @IsString()
    ipaddress?: string;

    @ApiProperty({ description: 'Country ID', example: 1, required: false })
    @IsOptional()
    @IsNumber()
    countryId?: number;

    @ApiProperty({ description: 'Currency ID', example: 1, required: false })
    @IsOptional()
    @IsNumber()
    currencyId?: number;

    @ApiProperty({ description: 'Timezone ID', example: 1, required: false })
    @IsOptional()
    @IsNumber()
    timezoneId?: number;
}
