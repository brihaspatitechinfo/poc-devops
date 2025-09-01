import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import axios from 'axios';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { CognitoConfig } from './cognito.config';
import { CognitoService } from './cognito.service';
import { ConfirmForgotPasswordDto } from './dto/confirm-forgot-password.dto';
import { ConfirmRegistrationDto } from './dto/confirm-registration.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly cognitoService: CognitoService,
    private readonly cognitoConfig: CognitoConfig,
  ) { }

  async register(registerDto: RegisterDto) {
    const attributes = {
      'email': registerDto.email,
      'given_name': registerDto.firstName,
      'family_name': registerDto.lastName,
      // Temporarily comment out custom:role until Cognito User Pool is configured
      // 'custom:role': registerDto.role,
      ...(registerDto.phone && { 'phone_number': registerDto.phone }),
      'gender': registerDto.gender || 'Male',
    };

    // 1. Register user in Cognito
    let cognitoResult;
    try {
      cognitoResult = await this.cognitoService.signUp(
        registerDto.email,
        registerDto.password,
        attributes
      );

    } catch (error) {
      if (this.isCognitoUnavailable(error)) {
        throw new ServiceUnavailableException(
          'Authentication service is temporarily unavailable. Please try again later.'
        );
      }
      throw error;
    }


    // 2. Register user profile in User Service
    try {
      const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:3002';
      await axios.post(`${userServiceUrl}/api/v1/users/register`, {
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        role: registerDto.role,
        phone: registerDto.phone,
        gender: registerDto.gender,
        userId: cognitoResult.userId,
      });
    } catch (err) {
      // Log error, but don't fail registration if user service is down
      console.error('Failed to create user profile in User Service:', err.message);
    }
    return cognitoResult;
  }

  async confirmRegistration(confirmDto: ConfirmRegistrationDto) {
    return await this.cognitoService.confirmSignUp(
      confirmDto.email,
      confirmDto.confirmationCode
    );
  }

  async login(loginDto: LoginDto) {
    try {
      return await this.cognitoService.signIn(loginDto.email, loginDto.password);
    } catch (error) {
      if (this.isCognitoUnavailable(error)) {
        throw new ServiceUnavailableException(
          'Authentication service is temporarily unavailable. Please try again later.'
        );
      }
      throw error;
    }
  }

  private isCognitoUnavailable(error: any): boolean {
    return (
      error.code === 'NetworkingError' ||
      error.message?.includes('ENOTFOUND') ||
      error.message?.includes('ECONNREFUSED') ||
      error.message?.includes('Service Unavailable')
    );
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return await this.cognitoService.forgotPassword(forgotPasswordDto.email);
  }

  async confirmForgotPassword(confirmDto: ConfirmForgotPasswordDto) {
    return await this.cognitoService.confirmForgotPassword(
      confirmDto.email,
      confirmDto.confirmationCode,
      confirmDto.newPassword
    );
  }

  async verifyToken(token: string) {
    try {

      const region = process.env.AWS_REGION || 'ap-south-1';
      const userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;
      const clientId = process.env.AWS_COGNITO_CLIENT_ID;
      const issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;
      const jwksUri = `${issuer}/.well-known/jwks.json`;
      const JWKS = createRemoteJWKSet(new URL(jwksUri));
      let payload;
      try {
        // First try with audience validation (for ID tokens)
        const { payload: idTokenPayload } = await jwtVerify(token, JWKS, {
          issuer,
          audience: clientId,
        });
        payload = idTokenPayload;

      } catch (audienceError) {
        // If audience validation fails, try without audience (for access tokens)
        try {
          const { payload: accessTokenPayload } = await jwtVerify(token, JWKS, {
            issuer,
          });
          payload = accessTokenPayload;
          // For access tokens, verify client_id claim matches
          if (payload.client_id !== clientId) {
            throw new Error('Invalid client_id in access token');
          }
        } catch (accessTokenError) {
          // If both fail, throw the original audience error
          throw audienceError;
        }
      }
      return {
        userId: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        emailVerified: payload.email_verified,
        role: payload["custom:role"],
        username: payload["cognito:username"] || payload["username"] || payload["sub"],
        claims: payload
      };
    } catch (error) {
      console.error('JWT verification error:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        // Log any custom properties
        for (const key of Object.keys(error)) {
          // @ts-ignore
          console.error(`Error property [${key}]:`, error[key]);
        }
      }
      throw new Error('Invalid token');
    }
  }

  async getUserInfo(accessToken: string) {
    try {
      const userInfo = await this.cognitoService.getUser(accessToken);
      return {
        userId: userInfo.username,
        email: userInfo.attributes.email,
        firstName: userInfo.attributes.given_name,
        lastName: userInfo.attributes.family_name,
        status: userInfo.userStatus,
        enabled: userInfo.enabled,
        createdAt: userInfo.userCreateDate,
        lastModifiedAt: userInfo.userLastModifiedDate,
        role: userInfo.attributes['custom:role'],
      };
    } catch (error) {
      throw new Error('Failed to get user info');
    }
  }

  async createUser(email: string, password: string, attributes: Record<string, string> = {}) {
    return await this.cognitoService.createUser(email, password, attributes);
  }

  async setUserPassword(email: string, password: string, permanent: boolean = true) {
    return await this.cognitoService.setUserPassword(email, password, permanent);
  }

  async deleteUser(email: string) {
    return await this.cognitoService.deleteUser(email);
  }

  getLoginUrl(): string {
    const userPoolDomain = process.env.AWS_COGNITO_USER_POOL_DOMAIN;
    const clientId = this.cognitoConfig.getClientId();
    const redirectUri = process.env.AWS_COGNITO_REDIRECT_URI;

    return `https://${userPoolDomain}.auth.${this.cognitoConfig.getRegion()}.amazoncognito.com/login?client_id=${clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${redirectUri}`;
  }

  getLogoutUrl(): string {
    const userPoolDomain = process.env.AWS_COGNITO_USER_POOL_DOMAIN;
    const clientId = this.cognitoConfig.getClientId();
    const logoutUri = process.env.AWS_COGNITO_LOGOUT_URI;

    return `https://${userPoolDomain}.auth.${this.cognitoConfig.getRegion()}.amazoncognito.com/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
  }

  async refreshTokens(refreshToken: string) {
    return await this.cognitoService.refreshTokens(refreshToken);
  }

  async handleSsoCallback(code: string, state: string) {
    // This would typically exchange the authorization code for tokens
    // For now, return a mock response
    return {
      message: 'SSO callback processed successfully',
      code,
      state,
      tokens: {
        accessToken: 'mock-access-token',
        idToken: 'mock-id-token',
        refreshToken: 'mock-refresh-token',
      }
    };
  }

  async verifyEmail(userId: string) {
    try {
      await this.cognitoService.verifyEmail(userId);
      return { message: 'Email marked as verified' }
    } catch (error) {
      throw new BadRequestException('Failed to verify email');
    }
  }

  async confirmEmail(userId: string, confirmationCode: string) {
    return await this.cognitoService.confirmEmail(userId, confirmationCode);
  }

  async resendConfirmationCode(userId: string) {
    return await this.cognitoService.resendConfirmationCode(userId);
  }


}
