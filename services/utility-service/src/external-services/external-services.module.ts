import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UsersClient } from './user-service/users/users.client';

@Module({
    imports: [
        HttpModule.register({
            timeout: 10000,
            maxRedirects: 5,
        }),
    ],
    providers: [UsersClient],
    exports: [UsersClient],
})
export class ExternalServicesModule { } 