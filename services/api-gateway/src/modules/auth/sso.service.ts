import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SsoService {
  private readonly userPoolDomain: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly region: string;
  private readonly redirectUri: string;
  private readonly logoutUri: string;

  constructor(private configService: ConfigService) {
    this.userPoolDomain = this.configService.get<string>('AWS_COGNITO_USER_POOL_DOMAIN');
    this.clientId = this.configService.get<string>('AWS_COGNITO_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('AWS_COGNITO_CLIENT_SECRET');
    this.region = this.configService.get<string>('AWS_REGION');
    this.redirectUri = this.configService.get<string>('AWS_COGNITO_REDIRECT_URI');
    this.logoutUri = this.configService.get<string>('AWS_COGNITO_LOGOUT_URI');
  }

  getLoginUrl(): string {
    return `https://${this.userPoolDomain}.auth.${this.region}.amazoncognito.com/login?client_id=${this.clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${this.redirectUri}`;
  }

  getLogoutUrl(): string {
    return `https://${this.userPoolDomain}.auth.${this.region}.amazoncognito.com/logout?client_id=${this.clientId}&logout_uri=${this.logoutUri}`;
  }

  async exchangeCodeForTokens(code: string): Promise<any> {
    const tokenEndpoint = `https://${this.userPoolDomain}.auth.${this.region}.amazoncognito.com/oauth2/token`;
    
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code: code,
      redirect_uri: this.redirectUri,
    });

    try {
      const response = await axios.post(tokenEndpoint, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return {
        accessToken: response.data.access_token,
        idToken: response.data.id_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type,
      };
    } catch (error) {
      throw new Error(`Failed to exchange code for tokens: ${error.message}`);
    }
  }

  async refreshTokens(refreshToken: string): Promise<any> {
    const tokenEndpoint = `https://${this.userPoolDomain}.auth.${this.region}.amazoncognito.com/oauth2/token`;
    
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
    });

    try {
      const response = await axios.post(tokenEndpoint, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return {
        accessToken: response.data.access_token,
        idToken: response.data.id_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type,
      };
    } catch (error) {
      throw new Error(`Failed to refresh tokens: ${error.message}`);
    }
  }

  async getUserInfo(accessToken: string): Promise<any> {
    const userInfoEndpoint = `https://${this.userPoolDomain}.auth.${this.region}.amazoncognito.com/oauth2/userInfo`;
    
    try {
      const response = await axios.get(userInfoEndpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get user info: ${error.message}`);
    }
  }
} 