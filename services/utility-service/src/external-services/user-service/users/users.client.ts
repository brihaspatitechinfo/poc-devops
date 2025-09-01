// external-services/user-service/users/users.client.ts

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseExternalClient } from '../../base-external-client';
import { CreateUserDto } from './users.dto';
import { UserResponse } from './users.interface';

@Injectable()
export class UsersClient extends BaseExternalClient {
    constructor(configService: ConfigService, httpService: HttpService) {
        super(configService, httpService, 'USER_SERVICE_URL');
    }


    async getUserById(userId: string, token?: string): Promise<UserResponse> {
        try {
            return await this.get<UserResponse>(`/api/v1/users/${userId}`, token);
        } catch (error) {
            this.logger.error(`Failed to fetch user ${userId}: ${error.message}`);
            throw error;
        }
    }
    async getUserDetailsById(id: string): Promise<UserResponse> {
        try {
            return await this.get<UserResponse>(`/api/v1/users/${id}/with-details`);
        } catch (error) {
            this.logger.error(`Failed to fetch user ${id} with details: ${error.message}`);
            throw error;
        }
    }
    async getUserCreditBalance(id: string): Promise<number> {
        try {
            return await this.get<number>(`/api/v1/users/${id}/credit-balance`);
        } catch (error) {
            this.logger.error(`Failed to fetch user ${id} credit balance: ${error.message}`);
            throw error;
        }
    }
    async assignCredit(id: string, credit: number): Promise<{ statusCode: number; message: string; data: number }> {
        try {
            return await this.post<any>(`/api/v1/users/${id}/assign-credit`, { credit });
        } catch (error) {
            this.logger.error(`Failed to assign credit to user ${id}: ${error.message}`);
            throw error;
        }
    }
    async deductCredit(id: string, credit: number): Promise<{ statusCode: number; message: string; data: number }> {
        try {
            return await this.post<any>(`/api/v1/users/${id}/deduct-credit`, { credit });
        } catch (error) {
            this.logger.error(`Failed to deduct credit from user ${id}: ${error.message}`);
            throw error;
        }
    }
}
