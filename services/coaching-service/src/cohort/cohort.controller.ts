import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CohortService } from './cohort.service';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import { WitSelectCohort } from './entities/wit-select-cohort.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { CohortStatus } from './enums/cohort.enums';

@ApiTags('cohort')
@Controller('cohort')
export class CohortController {
  constructor(private readonly cohortService: CohortService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new cohort' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Cohort created successfully',
    type: WitSelectCohort
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST , description: 'Bad request - validation failed' })
  async create(@Body() createCohortDto: CreateCohortDto) {
    const result = await this.cohortService.create(createCohortDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Cohort created successfully',
      data: result
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all cohorts with filtering and pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cohorts retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/WitSelectCohort' }
        },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' }
          }
        }
      }
    }
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by cohort name' })
  @ApiQuery({ name: 'status', required: false, enum: CohortStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'cohortType', required: false, enum: [1, 2], description: 'Filter by cohort type' })
  @ApiQuery({ name: 'mentoringType', required: false, enum: [1, 2], description: 'Filter by mentoring type' })
  @ApiQuery({ name: 'isInternal', required: false, type: Boolean, description: 'Filter by internal/external' })
  @ApiQuery({ name: 'organizationId', required: false, type: Number, description: 'Filter by organization' })
  @ApiQuery({ name: 'createdBy', required: false, type: Number, description: 'Filter by creator' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
  async findAll(@Query() query: any) {
    const result = await this.cohortService.findAll(query);
    const { data, total, page, limit, totalPages } = result;
    return {
      statusCode: HttpStatus.OK,
      message: 'Cohorts retrieved',
      data,
      total,
      page,
      limit,
      totalPages
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cohort by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cohort retrieved successfully',
    type: WitSelectCohort
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Cohort not found' })
  async findOne(@Param('id') id: string) {
    const result = await this.cohortService.findOne(parseInt(id));
    return {
      statusCode: HttpStatus.OK,
      message: 'Cohort retrieved successfully',
      data: result
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cohort' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cohort updated successfully',
    type: WitSelectCohort
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request - validation failed' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Cohort not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCohortDto: UpdateCohortDto
  ) {
    await this.cohortService.update(parseInt(id), updateCohortDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Cohort updated successfully'
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a cohort' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Cohort deleted successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Cannot delete cohort with interactions' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Cohort not found' })
  async remove(@Param('id') id: string) {
    await this.cohortService.remove(parseInt(id));
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Cohort deleted successfully',
      data: null
    };
  }

@Post('upload/:cohortId')
@ApiOperation({ summary: 'Upload cohort mentees via Excel file' })
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
        description: 'Excel file to upload',
      },
    },
    required: ['file'],
  },
})
@ApiResponse({
  status: HttpStatus.OK,
  description: 'Excel processed and mentees registered',
  schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'number' },
      message: { type: 'string' },
      savedUsers: { type: 'array', items: { type: 'object' } },
      existingUsers: { type: 'array', items: { type: 'object' } },
      totalRows: { type: 'number' },
    },
  },
})
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'No file uploaded' })
@UseInterceptors(FileInterceptor('file'))
@HttpCode(HttpStatus.OK)
async uploadCohortExcel(
  @UploadedFile() file: Express.Multer.File,
  @Param('cohortId') cohortId: string
) {
  if (!file) {
    return { statusCode: HttpStatus.BAD_REQUEST, message: 'No file uploaded', data: null };
  }

  const workbook = XLSX.read(file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const result = await this.cohortService.uploadCohortExcelAndRegisterMentees(rows, cohortId);

  return {
    statusCode: HttpStatus.OK,
    message: result.message,
    savedUsers: result.savedUsers ?? [],
    existingUsers: result.existingUsers ?? [],
    totalRows: result.totalRows ?? 0,
  };
}
}