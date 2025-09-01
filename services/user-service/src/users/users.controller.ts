import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../permissions/permissions.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateDirectPermissionsDto } from './dto/update-direct-permissions.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(PermissionsGuard)
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Get()
  @Permissions('user:view')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Users retrieved successfully' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('active') active?: boolean) {
    return await this.usersService.findAll(page, limit, active);
  }

  @Get('profile')
  @Permissions('user:view')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async getCurrentUserProfile(@Headers('x-user-id') userId: string) {
    const user = await this.usersService.getCurrentUserProfile(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'User profile retrieved',
      data: user
    };
  }

  @Post('register')
  @Permissions('user:create')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User registered successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already exists' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async register(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User Created'
    };
  }

  @Post('multi-register')
  @ApiOperation({ summary: 'Register multiple users' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Users registered successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already exists' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @Permissions('user:create')
  async multiRegister(@Body() createUserDto: CreateUserDto[]) {
    const { savedUsers, existingUsers } = await this.usersService.multiRegister(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Users Created',
      savedUsers,
      existingUsers
    };
  }


  @Post('search')
  @Permissions('user:view')
  @ApiOperation({ summary: 'Search users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Users found successfully' })
  async searchUsers(@Body() searchCriteria: { query: string; filters?: any }) {
    return await this.usersService.searchUsers(searchCriteria.query, searchCriteria.filters);
  }

  @Post('confirm-registration')
  @ApiOperation({ summary: 'Confirm user registration' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Registration confirmed' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async confirmRegistration(@Body() body: { email: string; code: string }) {
    return await this.usersService.confirmRegistration(body.email, body.code);
  }

  @Get('modules-userwise-permissions')
  @Permissions('user:view')
  @ApiOperation({ summary: 'Get modules user with permissions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Modules user with permissions retrieved successfully' })
  async getModulesUserWithPermissions(@Headers('x-all-user-permissions') allUserPermissions: string[]) {
    return await this.usersService.getModulesUserWithPermissions(allUserPermissions);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User retrieved successfully' })
  @Permissions('user:view')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User retrieved',
      data: user
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated successfully' })
  @Permissions('user:edit')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.update(id, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User Updated'
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User deleted successfully' })
  @Permissions('user:delete')
  async remove(@Param('id') id: string) {
    const result = await this.usersService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User Deleted',
      data: result
    };
  }

  @Put('direct-permissions')
  @ApiOperation({ summary: 'Update user direct permissions' })
  @ApiParam({
    name: 'userId',
    description: 'User ID to update direct permissions for',
    example: 'user123',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'User direct permissions updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request - Invalid permissions format' })
  @Permissions('permission:edit')
  async updatePermissions(@Headers('x-user-id') userId: string, @Body() updateDirectPermissionsDto: UpdateDirectPermissionsDto) {
    await this.usersService.updateDirectPermissions({ userId, directPermissions: updateDirectPermissionsDto.directPermissions });
    return {
      statusCode: HttpStatus.OK,
      message: 'User Direct Permissions Updated'
    };
  }

  @Get(':userId/permissions')
  @ApiOperation({ summary: 'Get user permissions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User permissions retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async getUserPermissions(@Param('userId') userId: string) {
    const permissions = await this.usersService.findOneByUserId(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'User permissions retrieved',
      permissions: permissions || []
    };
  }

}




