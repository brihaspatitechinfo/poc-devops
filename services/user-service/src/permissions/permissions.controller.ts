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
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { PermissionsGuard } from '../guards/permissions.guard';
import { AppLogger } from '../logger/logger.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permissions } from './permissions.decorator';
import { PermissionsService } from './permissions.service';

@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(PermissionsGuard)
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly logger: AppLogger,
  ) { }

  @Post()
  @Permissions('permission:create')
  @ApiOperation({
    summary: 'Create a new permission',
    description: 'Creates a new permission with the provided details',
  })
  @ApiBody({
    type: CreatePermissionDto,
    description: 'Permission data to create',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Permission created successfully',
    schema: {
      example: {
        name: 'Can create User',
        description: 'Allows creation of new users',
        slug: 'user:create',
        module: 'user',
        action: 'create',
        createdAt: '2025-06-20T09:32:11.123Z',
        updatedAt: '2025-06-20T09:32:11.123Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Invalid data provided',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    const result = await this.permissionsService.create(createPermissionDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Permission Created',
      data: result
    };
  }

  @Get()
  @Permissions('permission:view')
  @ApiOperation({
    summary: 'Get all permissions',
    description: 'Retrieves all permissions from the database',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permissions retrieved successfully',
    schema: {
      example: [
        {
          _id: '665ffe123b7a4b0df8f12345',
          name: 'Can create User',
          description: 'Allows creation of new users',
          slug: 'user:create',
          module: 'user',
          action: 'create',
          createdAt: '2025-06-20T09:32:11.123Z',
          updatedAt: '2025-06-20T09:32:11.123Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('active') active?: boolean) {
    return await this.permissionsService.findAll(page, limit, active);
  }

  @Get(':id')
  @Permissions('permission:view')
  @ApiOperation({
    summary: 'Get permission by ID',
    description: 'Retrieves a specific permission by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Permission ID',
    example: '665ffe123b7a4b0df8f12345',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permission retrieved successfully',
    schema: {
      example: {
        _id: '665ffe123b7a4b0df8f12345',
        name: 'Can create User',
        description: 'Allows creation of new users',
        slug: 'user:create',
        module: 'user',
        action: 'create',
        createdAt: '2025-06-20T09:32:11.123Z',
        updatedAt: '2025-06-20T09:32:11.123Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Permission not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOne(@Param('id') id: string) {
    const permission = await this.permissionsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Permission retrieved',
      data: permission
    };
  }

  @Put(':id')
  @Permissions('permission:edit')
  @ApiOperation({
    summary: 'Update permission',
    description: 'Updates a specific permission by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Permission ID',
    example: '665ffe123b7a4b0df8f12345',
  })
  @ApiBody({
    type: UpdatePermissionDto,
    description: 'Permission data to update',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permission updated successfully',
    schema: {
      example: {
        _id: '665ffe123b7a4b0df8f12345',
        name: 'Can create User',
        description: 'Allows creation of new users',
        slug: 'user:create',
        module: 'user',
        action: 'create',
        createdAt: '2025-06-20T09:32:11.123Z',
        updatedAt: '2025-06-20T09:32:11.123Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Invalid data provided',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Permission not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    const result = await this.permissionsService.update(id, updatePermissionDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Permission Updated',
      data: result
    };
  }

  @Delete(':id')
  @Permissions('permission:delete')
  @ApiOperation({
    summary: 'Delete permission',
    description: 'Deletes a specific permission by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Permission ID',
    example: '665ffe123b7a4b0df8f12345',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permission deleted successfully',
    schema: {
      example: {
        _id: '665ffe123b7a4b0df8f12345',
        name: 'Can create User',
        description: 'Allows creation of new users',
        slug: 'user:create',
        module: 'user',
        action: 'create',
        createdAt: '2025-06-20T09:32:11.123Z',
        updatedAt: '2025-06-20T09:32:11.123Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Permission not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async remove(@Param('id') id: string) {
    const result = await this.permissionsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Permission Deleted',
      data: result
    };
  }
}
