import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppLogger } from '../logger/logger.service';
import { UsersModule } from '../users/users.module';
import { EmployeeProfileController } from './employee-profile.controller';
import { EmployeeProfileService } from './employee-profile.service';
import { EmployeeProfile, EmployeeProfileSchema } from './entities/employee-profile.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: EmployeeProfile.name, schema: EmployeeProfileSchema }
        ]),
        UsersModule
    ],
    controllers: [EmployeeProfileController],
    providers: [EmployeeProfileService, AppLogger],
    exports: [EmployeeProfileService],
})
export class EmployeeProfileModule { } 