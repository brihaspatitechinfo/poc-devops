import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSkillsMasterDto } from './dto/create-skills-master.dto';
import { SkillsMasterResponseDto } from './dto/skills-master-response.dto';
import { UpdateSkillsMasterDto } from './dto/update-skills-master.dto';
import { SkillsMasterService } from './skills-master.service';

@ApiTags('Skills Master')
@Controller('skills-master')
export class SkillsMasterController {
    constructor(private readonly skillsMasterService: SkillsMasterService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new skill' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Skill created successfully',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 201 },
                message: { type: 'string', example: 'Skill created successfully' }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad request - validation error or duplicate skill'
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error'
    })
    async create(@Body() createSkillsMasterDto: CreateSkillsMasterDto) {
        return this.skillsMasterService.create(createSkillsMasterDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all skills' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Skills retrieved successfully',
        type: [SkillsMasterResponseDto]
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error'
    })
    async findAll(): Promise<SkillsMasterResponseDto[]> {
        return this.skillsMasterService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a skill by ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Skill retrieved successfully',
        type: SkillsMasterResponseDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad request - invalid ID'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Skill not found'
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error'
    })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<SkillsMasterResponseDto> {
        return this.skillsMasterService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a skill by ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Skill updated successfully',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Skill updated successfully' }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad request - validation error, invalid ID, or duplicate skill'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Skill not found'
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error'
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSkillsMasterDto: UpdateSkillsMasterDto
    ) {
        return this.skillsMasterService.update(id, updateSkillsMasterDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a skill by ID (soft delete)' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Skill deleted successfully',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Skill deleted successfully' }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad request - invalid ID'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Skill not found'
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error'
    })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.skillsMasterService.remove(id);
    }

    @Get('search')
    @ApiOperation({ summary: 'Search skills by query' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Skills search completed successfully',
        type: [SkillsMasterResponseDto]
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error'
    })
    async searchSkills(@Query('q') query: string): Promise<SkillsMasterResponseDto[]> {
        return this.skillsMasterService.searchSkills(query);
    }

    @Get('category/:category')
    @ApiOperation({ summary: 'Get skills by category' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Skills by category retrieved successfully',
        type: [SkillsMasterResponseDto]
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error'
    })
    async getSkillsByCategory(@Param('category') category: string): Promise<SkillsMasterResponseDto[]> {
        return this.skillsMasterService.getSkillsByCategory(category);
    }

    @Get('active/list')
    @ApiOperation({ summary: 'Get all active skills' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Active skills retrieved successfully',
        type: [SkillsMasterResponseDto]
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error'
    })
    async getActiveSkills(): Promise<SkillsMasterResponseDto[]> {
        return this.skillsMasterService.getActiveSkills();
    }
} 