import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppLogger } from '../logger/logger.service';
import { PermissionsModule } from '../permissions/permissions.module';
import { Module as ModuleEntity, ModuleSchema } from './entities/module.entity';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ModuleEntity.name, schema: ModuleSchema }]), forwardRef(() => PermissionsModule)],
  controllers: [ModulesController],
  providers: [ModulesService, AppLogger],
  exports: [ModulesService],
})
export class ModulesModule { } 