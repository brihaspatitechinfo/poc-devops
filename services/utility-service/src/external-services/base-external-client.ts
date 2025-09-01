import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom, retry, timeout } from 'rxjs';

@Injectable()
export abstract class BaseExternalClient {
    protected readonly logger = new Logger(this.constructor.name);
    protected readonly baseUrl: string;
    protected readonly timeoutMs = 10000;
    protected readonly maxRetries = 3;

    constructor(
        protected readonly configService: ConfigService,
        protected readonly httpService: HttpService,
        serviceUrlKey: string
    ) {
        this.baseUrl = this.configService.get<string>(serviceUrlKey);
        if (!this.baseUrl) {
            throw new Error(`${serviceUrlKey} environment variable is required`);
        }
    }

    protected async makeRequest<T>(
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        endpoint: string,
        data?: any,
        token?: string,
        customTimeout?: number
    ): Promise<T> {
        const headers = this.getHeaders(token);
        const config: AxiosRequestConfig = {
            headers,
            timeout: customTimeout || this.timeoutMs,
        };
        if (data && method !== 'GET') {
            config.data = data;
        }
        const url = `${this.baseUrl}${endpoint}`;
        this.logger.log(`${method} ${url}`);
        try {
            const response = await firstValueFrom(
                this.httpService.request<T>({
                    method: method.toLowerCase(),
                    url,
                    ...config,
                }).pipe(
                    timeout(customTimeout || this.timeoutMs),
                    retry(this.maxRetries),
                    catchError((error: AxiosError) => this.handleHttpError(error, `${method} ${endpoint}`))
                )
            );
            return response.data;
        } catch (error) {
            this.logger.error(`Request failed: ${method} ${url} - ${error.message}`);
            throw error;
        }
    }

    protected async get<T>(endpoint: string, token?: string, customTimeout?: number): Promise<T> {
        return this.makeRequest<T>('GET', endpoint, undefined, token, customTimeout);
    }

    protected async post<T>(endpoint: string, data: any, token?: string, customTimeout?: number): Promise<T> {
        return this.makeRequest<T>('POST', endpoint, data, token, customTimeout);
    }

    protected async put<T>(endpoint: string, data: any, token?: string, customTimeout?: number): Promise<T> {
        return this.makeRequest<T>('PUT', endpoint, data, token, customTimeout);
    }

    protected async patch<T>(endpoint: string, data: any, token?: string, customTimeout?: number): Promise<T> {
        return this.makeRequest<T>('PATCH', endpoint, data, token, customTimeout);
    }

    protected async delete<T>(endpoint: string, token?: string, customTimeout?: number): Promise<T> {
        return this.makeRequest<T>('DELETE', endpoint, undefined, token, customTimeout);
    }

    protected getHeaders(token?: string): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        // if (token) {
        //     headers['Authorization'] = `Bearer ${token}`;
        // }
        return headers;
    }

    protected handleHttpError(error: AxiosError, context: string): never {
        const status = error.response?.status || 500;
        const message = (error.response?.data as { message: string })?.message || error.message;
        this.logger.error(`[${context}] HTTP ${status} - ${message}`, {
            url: error.config?.url,
            method: error.config?.method,
            status,
            message,
        });

        switch (status) {
            case 400:
                throw new HttpException(`Bad Request: ${message}`, HttpStatus.BAD_REQUEST);
            case 401:
                throw new HttpException(`Unauthorized: ${message}`, HttpStatus.UNAUTHORIZED);
            case 403:
                throw new HttpException(`Forbidden: ${message}`, HttpStatus.FORBIDDEN);
            case 404:
                throw new HttpException(`Not Found: ${message}`, HttpStatus.NOT_FOUND);
            case 409:
                throw new HttpException(`Conflict: ${message}`, HttpStatus.CONFLICT);
            case 422:
                throw new HttpException(`Validation Error: ${message}`, HttpStatus.UNPROCESSABLE_ENTITY);
            case 503:
                throw new HttpException(`Service Unavailable: ${message}`, HttpStatus.SERVICE_UNAVAILABLE);
            default:
                throw new HttpException(`Internal Server Error: ${message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async checkServiceHealth(): Promise<boolean> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.baseUrl}/api/v1/health`).pipe(
                    timeout(5000),
                    catchError(() => [])
                )
            );
            return response.status === 200;
        } catch (error) {
            this.logger.warn(`${this.constructor.name} health check failed: ${error.message}`);
            return false;
        }
    }
} 