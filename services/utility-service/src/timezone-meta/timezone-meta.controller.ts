import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TimezoneMetaResponseDto } from './dto/timezone-meta-response.dto';
import { TimezoneMetaService } from './timezone-meta.service';

@ApiTags('Timezone Meta')
@Controller('timezone-meta')
export class TimezoneMetaController {
    constructor(private readonly timezoneMetaService: TimezoneMetaService) { }

    @Get('timezone/:timezoneId')
    @ApiOperation({ summary: 'Get timezone meta by ID' })
    @ApiResponse({ status: 200, description: 'Timezone meta details', type: TimezoneMetaResponseDto })
    @ApiParam({ name: 'timezoneId', description: 'Timezone ID', type: Number })
    async getTimezoneMeta(@Param('timezoneId', ParseIntPipe) timezoneId: number): Promise<TimezoneMetaResponseDto> {
        return this.timezoneMetaService.getTimezoneMeta(timezoneId);
    }
} 