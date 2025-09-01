import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { PermissionsGuard } from '../guards/permissions.guard';
import { AppLogger } from '../logger/logger.service';
import { Permissions } from '../permissions/permissions.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';
@ApiTags('Roles Management')
@Controller('roles')
@UseGuards(PermissionsGuard)
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly logger: AppLogger,
  ) { }

  @Post()
  @Permissions('role:create')
  @ApiOperation({
    summary: 'Create a new role',
    description: 'Create a new role with name, slug, display name, level, category, and optional permissions',
  })
  @ApiBody({
    type: CreateRoleDto,
    description: 'Role data to create',
    examples: {
      admin: {
        summary: 'Admin Role',
        value: {
          name: 'Admin',
          slug: 'role_admin',
          description: 'Administrator role with full access',
          rolePermissions: ['user:create', 'user:read', 'user:update', 'user:delete'],
          isActive: true,
        },
      },
      user: {
        summary: 'User Role',
        value: {
          name: 'User',
          slug: 'role_user',
          description: 'Standard user with basic permissions',
          rolePermissions: ['user:read'],
          isActive: true,
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Role created successfully',
    type: RoleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data or role already exists',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiConflictResponse({
    description: 'Role already exists',
  })
  async create(@Body() createRoleDto: CreateRoleDto) {
      const result = await this.rolesService.create(createRoleDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Role Created',
        data: result
      };
  }

  @Get()
  @Permissions('role:view')
  @ApiOperation({
    summary: 'Get all roles',
    description: 'Retrieve a list of all roles, optionally filtered by category or active status',
  })
  @ApiQuery({
    name: 'active',
    required: false,
    description: 'Filter roles by active status',
    type: Boolean,
    example: true,
  })
  @ApiOkResponse({
    description: 'Roles retrieved successfully',
    type: [RoleResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'No roles found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findAll(@Query('active') active?: boolean , @Query('page') page = 1, @Query('limit') limit = 10) {
    let roles = await this.rolesService.findAll(page, limit, active);
    return roles;
  }


  @Get(':id')
  @Permissions('role:view')
  @ApiOperation({
    summary: 'Get role by ID',
    description: 'Retrieve a specific role by their ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description: 'Role retrieved successfully',
    type: RoleResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid role ID',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findOne(@Param('id') id: string) {
      const role = await this.rolesService.findById(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Role retrieved',
        data: role
      };
    
  }


  @Put(':id')
  @Permissions('role:edit')
  @ApiOperation({
    summary: 'Update role',
    description: "Update an existing role's information",
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    type: UpdateRoleDto,
    description: 'Role update data',
    examples: {
      updateName: {
        summary: 'Update Role Name',
        value: {
          name: 'Super Admin',
          description: 'Updated description for super admin role',
        },
      },
      updatePermissions: {
        summary: 'Update Role Permissions',
        value: {
          rolePermissions: ['user:create', 'user:read', 'user:update', 'user:delete', 'role:create'],
        },
      },
      deactivateRole: {
        summary: 'Deactivate Role',
        value: {
          isActive: false,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Role updated successfully',
    type: RoleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data or role already exists',
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const result = await this.rolesService.update(id, updateRoleDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Role Updated',
      data: result
    };
  }

  @Delete(':id')
  @Permissions('role:delete')
  @ApiOperation({
    summary: 'Delete role',
    description: 'Delete a role by their ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOkResponse({
    description: 'Role deleted successfully',
    type: RoleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid role ID',
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async remove(@Param('id') id: string) {
      const result = await this.rolesService.delete(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Role Deleted',
        data: result
      };
  }
} 