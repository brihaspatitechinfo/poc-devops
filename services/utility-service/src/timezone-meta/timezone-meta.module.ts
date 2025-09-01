import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimezoneMaster } from '../timezone/timezone-master.entity';
import { TimezoneMeta } from './entities/timezone-meta.entity';
import { TimezoneMetaController } from './timezone-meta.controller';
import { TimezoneMetaService } from './timezone-meta.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([TimezoneMeta, TimezoneMaster]),
        CacheModule.register()
    ],
    controllers: [TimezoneMetaController],
    providers: [TimezoneMetaService],
    exports: [TimezoneMetaService],
})
export class TimezoneMetaModule { } 