import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoModule } from './crypto/crypto.module';
import { EmployeeProfileModule } from './employee-profile/employee-profile.module';
import { HealthModule } from './health/health.module';
import { ModulesModule } from './modules/modules.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { UsersModule } from './users/users.module';
// import { UserSettingsModule } from './user-settings/user-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://54.221.52.72:27017/myappuser'),
    UsersModule,
    HealthModule,
    CryptoModule,
    RolesModule,
    PermissionsModule,
    ModulesModule,
    EmployeeProfileModule,
    UserSettingsModule,
  ],
})
export class AppModule { }
