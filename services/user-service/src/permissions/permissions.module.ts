import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { Permission, PermissionSchema } from './entities/permission.entity';
import { AppLogger } from '../logger/logger.service';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule)
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService, AppLogger],
  exports: [PermissionsService],
})
export class PermissionsModule {}
