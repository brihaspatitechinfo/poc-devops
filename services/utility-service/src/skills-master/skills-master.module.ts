import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsMaster } from './entities/skills-master.entity';
import { SkillsMasterController } from './skills-master.controller';
import { SkillsMasterService } from './skills-master.service';

@Module({
    imports: [TypeOrmModule.forFeature([SkillsMaster])],
    controllers: [SkillsMasterController],
    providers: [SkillsMasterService],
    exports: [SkillsMasterService],
})
export class SkillsMasterModule { } 