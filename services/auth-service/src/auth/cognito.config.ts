import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  AdminGetUserCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminDeleteUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class CognitoConfig {
  private readonly cognitoClient: CognitoIdentityProviderClient;
  private readonly userPoolId: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly region: string;

  constructor(private configService: ConfigService) {
    this.userPoolId = this.configService.get<string>('AWS_COGNITO_USER_POOL_ID');
    this.clientId = this.configService.get<string>('AWS_COGNITO_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('AWS_COGNITO_CLIENT_SECRET');
    this.region = this.configService.get<string>('AWS_REGION');

    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  getCognitoClient(): CognitoIdentityProviderClient {
    return this.cognitoClient;
  }

  getUserPoolId(): string {
    return this.userPoolId;
  }

  getClientId(): string {
    return this.clientId;
  }

  getClientSecret(): string {
    return this.clientSecret;
  }

  getRegion(): string {
    return this.region;
  }

  // Helper method to calculate SECRET_HASH
  calculateSecretHash(username: string): string {
    const crypto = require('crypto');
    const message = username + this.clientId;
    const hmac = crypto.createHmac('SHA256', this.clientSecret);
    hmac.update(message);
    return hmac.digest('base64');
  }
} 