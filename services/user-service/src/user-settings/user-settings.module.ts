import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSetting, UserSettingSchema } from './entities/user-setting.entity';
import { UserSettingsController } from './user-settings.controller';
import { UserSettingsService } from './user-settings.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: UserSetting.name, schema: UserSettingSchema }
        ])
    ],
    controllers: [UserSettingsController],
    providers: [UserSettingsService],
    exports: [UserSettingsService]
})
export class UserSettingsModule { } 