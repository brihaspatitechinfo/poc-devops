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
import { PermissionsGuard } from '../guards/permissions.guard';
import { AppLogger } from '../logger/logger.service';
import { Permissions } from '../permissions/permissions.decorator';
import { CreateModuleDto } from './dto/create-module.dto';
import { ModuleResponseDto } from './dto/module-response.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModulesService } from './modules.service';

@ApiTags('Modules')
@Controller('modules')
@UseGuards(PermissionsGuard)
export class ModulesController {
  constructor(
    private readonly modulesService: ModulesService,
    private readonly logger: AppLogger,
  ) { }

  @Post()
  @Permissions('module:create')
  @ApiOperation({
    summary: 'Create a new module',
    description: 'Creates a new module with the provided details',
  })
  @ApiBody({
    type: CreateModuleDto,
    description: 'Module data to create',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Module created successfully',
    type: ModuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Invalid data provided',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict - Module with same name or slug already exists',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createModuleDto: CreateModuleDto) {
      const result = await this.modulesService.create(createModuleDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Module created',
        data: result,
      };
  }

  @Get()
  @Permissions('module:view')
  @ApiOperation({
    summary: 'Get all modules',
    description: 'Retrieves all modules from the database',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter modules by status',
    example: 'true',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Modules retrieved successfully',
    type: [ModuleResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('active') active?: boolean) {
      const result = await this.modulesService.findAll(page, limit, active);
      return {
        modules: result.modules,
        total: result.total,
        page: result.page,
        limit: result.limit
      };  
  }

  @Get(':id')
  @Permissions('module:view')
  @ApiOperation({
    summary: 'Get module by ID',
    description: 'Retrieves a specific module by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Module ID',
    example: '665ffe123b7a4b0df8f12345',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Module retrieved successfully',
    type: ModuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Module not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findOne(@Param('id') id: string) {
    const module = await this.modulesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Module retrieved',
      data: module,
    };
  }

  @Put(':id')
  @Permissions('module:edit')
  @ApiOperation({
    summary: 'Update module',
    description: 'Updates a specific module by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Module ID',
    example: '665ffe123b7a4b0df8f12345',
  })
  @ApiBody({
    type: UpdateModuleDto,
    description: 'Module data to update',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Module updated successfully',
    type: ModuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Invalid data provided',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Module not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict - Module with same name or slug already exists',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
      const result = await this.modulesService.update(id, updateModuleDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Module updated',
        data: result,
      };
  }

  @Delete(':id')
  @Permissions('module:delete')
  @ApiOperation({
    summary: 'Delete module',
    description: 'Deletes a specific module by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Module ID',
    example: '665ffe123b7a4b0df8f12345',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Module deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Module not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async remove(@Param('id') id: string) {
      const result = await this.modulesService.remove(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Module deleted successfully',
        data: result,
      };
  }
} 