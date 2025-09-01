import { Controller, Post, Get, Req, Res, Query, All } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SsoService } from './sso.service';
import { Request, Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly ssoService: SsoService,
  ) {}

  // SSO endpoints - these must come BEFORE the catch-all route
  @Get('sso/login')
  @ApiOperation({ summary: 'Get SSO login URL' })
  @ApiResponse({ status: 200, description: 'SSO login URL retrieved' })
  async getSsoLoginUrl() {
    return { loginUrl: this.ssoService.getLoginUrl() };
  }

  @Get('sso/logout')
  @ApiOperation({ summary: 'Get SSO logout URL' })
  @ApiResponse({ status: 200, description: 'SSO logout URL retrieved' })
  async getSsoLogoutUrl() {
    return { logoutUrl: this.ssoService.getLogoutUrl() };
  }

  @Get('sso/callback')
  @ApiOperation({ summary: 'SSO callback endpoint' })
  @ApiQuery({ name: 'code', description: 'Authorization code from Cognito' })
  @ApiQuery({ name: 'state', description: 'State parameter for CSRF protection' })
  @ApiResponse({ status: 200, description: 'SSO callback processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid callback parameters' })
  async ssoCallback(@Query('code') code: string, @Query('state') state: string) {
    try {
      const tokens = await this.ssoService.exchangeCodeForTokens(code);
      const userInfo = await this.ssoService.getUserInfo(tokens.accessToken);
      
      return {
        message: 'SSO authentication successful',
        tokens,
        userInfo,
        state,
      };
    } catch (error) {
      throw new Error(`SSO callback failed: ${error.message}`);
    }
  }

  @Post('sso/refresh')
  @ApiOperation({ summary: 'Refresh SSO tokens' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid refresh token' })
  async refreshTokens(@Req() req: Request) {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    try {
      const tokens = await this.ssoService.refreshTokens(refreshToken);
      return {
        message: 'Tokens refreshed successfully',
        tokens,
      };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  @Get('sso/user-info')
  @ApiOperation({ summary: 'Get SSO user information' })
  @ApiResponse({ status: 200, description: 'User information retrieved' })
  @ApiResponse({ status: 401, description: 'Invalid access token' })
  async getUserInfo(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      throw new Error('Access token is required');
    }

    try {
      const userInfo = await this.ssoService.getUserInfo(accessToken);
      return {
        message: 'User information retrieved successfully',
        userInfo,
      };
    } catch (error) {
      throw new Error(`Failed to get user info: ${error.message}`);
    }
  }

  // Base route for auth endpoints - proxy to auth service
  @All()
  async proxyToAuthServiceRoot(@Req() req: Request, @Res() res: Response) {
    return this.authService.proxyRequest(req, res);
  }

  // Catch-all route for auth endpoints - proxy to auth service
  // This must come AFTER all specific SSO routes
  @All('*')
  async proxyToAuthService(@Req() req: Request, @Res() res: Response) {
    return this.authService.proxyRequest(req, res);
  }
}
