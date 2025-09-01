import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SubModuleDto {
    @ApiProperty({
        example: 'Cohort',
        description: 'Name of the sub-module',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'cohort',
        description: 'Slug of the sub-module',
    })
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiProperty({
        example: 'Cohort management',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: true,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
