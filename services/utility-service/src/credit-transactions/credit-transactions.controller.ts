import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreditTransactionsService } from './credit-transactions.service';
import { CreateCreditTransactionDto } from './dto/create-credit-transaction.dto';
import { CreditTransactionResponseDto } from './dto/credit-transaction-response.dto';
import { UpdateCreditTransactionDto } from './dto/update-credit-transaction.dto';
import { CreditModule } from './entities/credit-transactions.entity';

@ApiTags('Credit Transactions')
@Controller('credit-transactions')
export class CreditTransactionsController {
    constructor(private readonly creditTransactionsService: CreditTransactionsService) { }


    @Post()
    @ApiOperation({ summary: 'Create a new credit transaction' })
    @ApiResponse({
        status: 201,
        description: 'Credit transaction created successfully',
        type: CreditTransactionResponseDto
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async create(@Body() createCreditTransactionDto: CreateCreditTransactionDto): Promise<{ statusCode: number; message: string; }> {
        return this.creditTransactionsService.create(createCreditTransactionDto);
    }


    @Post("assign-credit-to-corporate")
    @ApiOperation({ summary: 'Create a new credit transaction' })
    @ApiResponse({
        status: 201,
        description: 'Credit transaction created successfully',
        type: CreditTransactionResponseDto
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async assignCreditToCorporate(@Body() createCreditTransactionDto: CreateCreditTransactionDto): Promise<{ statusCode: number; message: string; }> {
        return this.creditTransactionsService.assignCreditToCorporate(createCreditTransactionDto);
    }


    @Post("deduct-credit-from-corporate")
    @ApiOperation({ summary: 'Create a new credit transaction' })
    @ApiResponse({
        status: 201,
        description: 'Credit transaction created successfully',
        type: CreditTransactionResponseDto
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async deductCreditFromCorporate(@Body() createCreditTransactionDto: CreateCreditTransactionDto): Promise<{ statusCode: number; message: string; }> {
        return this.creditTransactionsService.deductCreditFromCorporate(createCreditTransactionDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a credit transaction' })
    @ApiParam({ name: 'id', description: 'Credit transaction ID', type: 'number' })
    @ApiResponse({
        status: 200,
        description: 'Credit transaction updated successfully',
        type: CreditTransactionResponseDto
    })
    @ApiResponse({ status: 404, description: 'Credit transaction not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async update(
        @Param('id') id: number,
        @Body() updateCreditTransactionDto: UpdateCreditTransactionDto
    ): Promise<CreditTransactionResponseDto> {
        return this.creditTransactionsService.update(id, updateCreditTransactionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all credit transactions' })
    @ApiResponse({
        status: 200,
        description: 'List of credit transactions',
        type: [CreditTransactionResponseDto]
    })
    async findAll(): Promise<CreditTransactionResponseDto[]> {
        return this.creditTransactionsService.findAll();
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get credit transaction statistics' })
    @ApiResponse({
        status: 200,
        description: 'Transaction statistics',
        schema: {
            type: 'object',
            properties: {
                totalTransactions: { type: 'number' },
                totalAmountTransferred: { type: 'number' },
                averageTransactionAmount: { type: 'number' }
            }
        }
    })
    async getStats() {
        return this.creditTransactionsService.getTransactionStats();
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get credit transactions by user ID' })
    @ApiParam({ name: 'userId', description: 'User ID', type: 'string' })
    @ApiResponse({
        status: 200,
        description: 'List of credit transactions for the user',
        type: [CreditTransactionResponseDto]
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findByUserId(@Param('userId') userId: string): Promise<CreditTransactionResponseDto[]> {
        return this.creditTransactionsService.findByUserId(userId);
    }

    @Get('module/:module')
    @ApiOperation({ summary: 'Get credit transactions by module' })
    @ApiParam({
        name: 'module',
        description: 'Module type',
        enum: CreditModule,
        example: 'WOCADEMY'
    })
    @ApiResponse({
        status: 200,
        description: 'List of credit transactions for the module',
        type: [CreditTransactionResponseDto]
    })
    async findByModule(@Param('module') module: string): Promise<CreditTransactionResponseDto[]> {
        return this.creditTransactionsService.findByModule(module);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a credit transaction by ID' })
    @ApiParam({ name: 'id', description: 'Credit transaction ID', type: 'number' })
    @ApiResponse({
        status: 200,
        description: 'Credit transaction details',
        type: CreditTransactionResponseDto
    })
    @ApiResponse({ status: 404, description: 'Credit transaction not found' })
    async findOne(@Param('id') id: number): Promise<CreditTransactionResponseDto> {
        return this.creditTransactionsService.findOne(id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a credit transaction' })
    @ApiParam({ name: 'id', description: 'Credit transaction ID', type: 'number' })
    @ApiResponse({ status: 204, description: 'Credit transaction deleted successfully' })
    @ApiResponse({ status: 404, description: 'Credit transaction not found' })
    async remove(@Param('id') id: number): Promise<void> {
        return this.creditTransactionsService.remove(id);
    }

    @Post('total-credits-of-corporate/:userId')
    @ApiOperation({ summary: 'Get total module credits of corporate' })
    @ApiParam({ name: 'userId', description: 'User ID', type: 'string' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Total module credits of corporate', type: Number })
    async getTotalModuleCreditsOfCorporate(@Param('userId') userId: string, @Body() transferredByIds: any): Promise<number> {
        return this.creditTransactionsService.getTotalCreditsOfCorporateByTransferredByIds(userId, transferredByIds);
    }

} 