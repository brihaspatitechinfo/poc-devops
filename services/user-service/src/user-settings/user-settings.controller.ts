import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserSettingDto } from './dto/create-user-setting.dto';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';
import { UserSettingResponseDto } from './dto/user-setting-response.dto';
import { UserSettingsService } from './user-settings.service';

@ApiTags('User Settings')
@Controller('settings')
export class UserSettingsController {
    constructor(private readonly userSettingsService: UserSettingsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new user setting' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'User setting created successfully', type: UserSettingResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    create(@Body() createUserSettingDto: CreateUserSettingDto) {
        return this.userSettingsService.create(createUserSettingDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all user settings' })
    @ApiResponse({ status: HttpStatus.OK, description: 'List of all user settings', type: [UserSettingResponseDto] })
    findAll() {
        return this.userSettingsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a user setting by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'User setting found', type: UserSettingResponseDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User setting not found' })
    findOne(@Param('id') id: string) {
        return this.userSettingsService.findOne(id);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get user settings by user ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'User settings found', type: [UserSettingResponseDto] })
    findByUserId(@Param('userId') userId: string) {
        return this.userSettingsService.findByUserId(userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a user setting' })
    @ApiResponse({ status: HttpStatus.OK, description: 'User setting updated successfully', type: UserSettingResponseDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User setting not found' })
    update(@Param('id') id: string, @Body() updateUserSettingDto: UpdateUserSettingDto) {
        return this.userSettingsService.update(id, updateUserSettingDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete a user setting' })
    @ApiResponse({ status: HttpStatus.OK, description: 'User setting deleted successfully', type: UserSettingResponseDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User setting not found' })
    remove(@Param('id') id: string) {
        return this.userSettingsService.remove(id);
    }

    @Delete(':id/hard')
    @ApiOperation({ summary: 'Hard delete a user setting' })
    @ApiResponse({ status: HttpStatus.OK, description: 'User setting permanently deleted' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User setting not found' })
    hardDelete(@Param('id') id: string) {
        return this.userSettingsService.hardDelete(id);
    }
} 