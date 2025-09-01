import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
// import { PermissionsGuard } from '../guards/permissions.guard';
import { AppLogger } from '../logger/logger.service';
import { Permissions } from '../permissions/permissions.decorator';
import { CreateEmployeeProfileDto } from './dto/create-employee-profile.dto';
import { EmployeeProfileResponseDto } from './dto/employee-profile-response.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';
import { EmployeeProfileService } from './employee-profile.service';

@ApiTags('Employee Profile')
@Controller('employee-profile')
// @UseGuards(PermissionsGuard)
export class EmployeeProfileController {
    constructor(
        private readonly employeeProfileService: EmployeeProfileService,
        private readonly logger: AppLogger,
    ) { }

    @Post()
    // @Permissions('employee-profile:create')
    @ApiOperation({
        summary: 'Create a new employee profile',
        description: 'Creates a new employee profile with the provided details',
    })
    @ApiBody({
        type: CreateEmployeeProfileDto,
        description: 'Employee profile data to create',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Employee profile created successfully',
        type: EmployeeProfileResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad request - Invalid data provided',
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Conflict - Employee profile with same user ID or org slug already exists',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createEmployeeProfileDto: CreateEmployeeProfileDto) {
        const result = await this.employeeProfileService.create(createEmployeeProfileDto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Employee profile created',
            data: result,
        };
    }

    @Get()
    // @Permissions('employee-profile:view')
    @ApiOperation({
        summary: 'Get all employee profiles',
        description: 'Retrieves all employee profiles from the database',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        example: '1',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Number of items per page',
        example: '10',
    })
    @ApiQuery({
        name: 'active',
        required: false,
        description: 'Filter profiles by active status',
        example: 'true',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Employee profiles retrieved successfully',
        type: [EmployeeProfileResponseDto],
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('active') active?: boolean
    ) {
        const result = await this.employeeProfileService.findAll(page, limit, active);
        return {
            statusCode: HttpStatus.OK,
            message: 'Employee profiles retrieved successfully',
            data: {
                profiles: result.profiles,
                pagination: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: Math.ceil(result.total / result.limit),
                },
            },
        };
    }

    @Get(':id')
    // @Permissions('employee-profile:view')
    @ApiOperation({
        summary: 'Get employee profile by ID',
        description: 'Retrieves a specific employee profile by its ID',
    })
    @ApiParam({
        name: 'id',
        description: 'Employee profile ID',
        example: '507f1f77bcf86cd799439011',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Employee profile retrieved successfully',
        type: EmployeeProfileResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Employee profile not found',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
    async findOne(@Param('id') id: string) {
        const result = await this.employeeProfileService.findOne(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Employee profile retrieved successfully',
            data: result,
        };
    }

    @Get('user/:userId')
    // @Permissions('employee-profile:view')
    @ApiOperation({
        summary: 'Get employee profile by user ID',
        description: 'Retrieves a specific employee profile by user ID',
    })
    @ApiParam({
        name: 'userId',
        description: 'User ID',
        example: '1',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Employee profile retrieved successfully',
        type: EmployeeProfileResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Employee profile not found',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
    async findByUserId(@Param('userId') userId: number) {
        const result = await this.employeeProfileService.findByUserId(userId);
        return {
            statusCode: HttpStatus.OK,
            message: 'Employee profile retrieved successfully',
            data: result,
        };
    }

    @Get('org/:orgSlug')
    // @Permissions('employee-profile:view')
    @ApiOperation({
        summary: 'Get employee profile by organization slug',
        description: 'Retrieves a specific employee profile by organization slug',
    })
    @ApiParam({
        name: 'orgSlug',
        description: 'Organization slug',
        example: 'tech-solutions-inc',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Employee profile retrieved successfully',
        type: EmployeeProfileResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Employee profile not found',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
    async findByOrgSlug(@Param('orgSlug') orgSlug: string) {
        const result = await this.employeeProfileService.findByOrgSlug(orgSlug);
        return {
            statusCode: HttpStatus.OK,
            message: 'Employee profile retrieved successfully',
            data: result,
        };
    }

    @Put(':id')
    // @Permissions('employee-profile:update')
    @ApiOperation({
        summary: 'Update employee profile',
        description: 'Updates an existing employee profile with the provided data',
    })
    @ApiParam({
        name: 'id',
        description: 'Employee profile ID',
        example: '507f1f77bcf86cd799439011',
    })
    @ApiBody({
        type: UpdateEmployeeProfileDto,
        description: 'Employee profile data to update',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Employee profile updated successfully',
        type: EmployeeProfileResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad request - Invalid data provided',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Employee profile not found',
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Conflict - Employee profile with same user ID or org slug already exists',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
    async update(
        @Param('id') id: string,
        @Body() updateEmployeeProfileDto: UpdateEmployeeProfileDto
    ) {
        const result = await this.employeeProfileService.update(id, updateEmployeeProfileDto);
        return {
            statusCode: HttpStatus.OK,
            message: 'Employee profile updated successfully',
            data: result,
        };
    }

    @Delete(':id')
    @Permissions('employee-profile:delete')
    @ApiOperation({
        summary: 'Delete employee profile',
        description: 'Deletes an employee profile by its ID',
    })
    @ApiParam({
        name: 'id',
        description: 'Employee profile ID',
        example: '507f1f77bcf86cd799439011',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Employee profile deleted successfully',
        type: EmployeeProfileResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Employee profile not found',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
    async remove(@Param('id') id: string) {
        const result = await this.employeeProfileService.remove(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Employee profile deleted successfully',
            data: result,
        };
    }
} 