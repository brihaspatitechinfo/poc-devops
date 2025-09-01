import { MongooseModule } from '@nestjs/mongoose';
import { Module, forwardRef } from '@nestjs/common';
import { CryptoModule } from '../crypto/crypto.module';
import { LoggerModule } from '../logger/logger.module';
import { ModulesModule } from '../modules/modules.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesModule } from '../roles/roles.module';
import { User, UserSchema } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name , schema: UserSchema }]),
    LoggerModule,
    CryptoModule,
    forwardRef(() => PermissionsModule),
    RolesModule,
    forwardRef(() => ModulesModule)
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {} 