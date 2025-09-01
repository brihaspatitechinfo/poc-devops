import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditTransactionsController } from './credit-transactions.controller';
import { CreditTransactionsService } from './credit-transactions.service';
import { CreditTransaction } from './entities/credit-transactions.entity';
import { ExternalServicesModule } from '../external-services/external-services.module';
@Module({
    imports: [TypeOrmModule.forFeature([CreditTransaction]), ExternalServicesModule],
    controllers: [CreditTransactionsController],
    providers: [CreditTransactionsService],
    exports: [CreditTransactionsService],
})
export class CreditTransactionsModule { } 