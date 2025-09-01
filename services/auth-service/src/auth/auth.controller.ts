import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ConfirmForgotPasswordDto } from './dto/confirm-forgot-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
// import { AppLogger } from '../logger/logger.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User registered successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password reset email sent' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('confirm-forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm password reset' })
  @ApiBody({ type: ConfirmForgotPasswordDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password changed successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async confirmForgotPassword(@Body() confirmDto: ConfirmForgotPasswordDto) {
    return this.authService.confirmForgotPassword(confirmDto);
  }

  @Get('verify-token')
  @ApiOperation({ summary: 'Verify access token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Token verified' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid token' })
  async verifyToken(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '') || '';
    return this.authService.verifyToken(token);
  }

  @Get('login-url')
  @ApiOperation({ summary: 'Get SSO login URL' })
  @ApiResponse({ status: HttpStatus.OK, description: 'SSO login URL retrieved' })
  async getLoginUrl() {
    return { loginUrl: this.authService.getLoginUrl() };
  }

  @Get('logout-url')
  @ApiOperation({ summary: 'Get SSO logout URL' })
  @ApiResponse({ status: HttpStatus.OK, description: 'SSO logout URL retrieved' })
  async getLogoutUrl() {
    return { logoutUrl: this.authService.getLogoutUrl() };
  }

  // SSO Callback endpoint
  @Get('sso/callback')
  @ApiOperation({ summary: 'SSO callback endpoint' })
  @ApiQuery({ name: 'code', description: 'Authorization code from Cognito' })
  @ApiQuery({ name: 'state', description: 'State parameter for CSRF protection' })
  @ApiResponse({ status: HttpStatus.OK, description: 'SSO callback processed' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid callback parameters' })
  async ssoCallback(@Query('code') code: string, @Query('state') state: string) {
    return this.authService.handleSsoCallback(code, state);
  }

  @Post('sso/refresh')
  @ApiOperation({ summary: 'Refresh SSO tokens' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tokens refreshed successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid refresh token' })
  async refreshTokens(@Body() body: { refreshToken: string }) {
    return this.authService.refreshTokens(body.refreshToken);
  }

  // Admin endpoints for authentication management only
  @Post('admin/create-user')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user in Cognito (Admin only)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async createUser(
    @Body() body: { email: string; password: string; attributes?: Record<string, string> }
  ) {
    return this.authService.createUser(body.email, body.password, body.attributes || {});
  }

  @Post('admin/set-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set user password in Cognito (Admin only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password set successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async setUserPassword(
    @Body() body: { email: string; password: string; permanent?: boolean }
  ) {
    return this.authService.setUserPassword(body.email, body.password, body.permanent ?? true);
  }

  @Post('admin/delete-user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user from Cognito (Admin only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User deleted successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async deleteUser(@Body() body: { email: string }) {
    return this.authService.deleteUser(body.email);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Email verified successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async verifyEmail(@Body() body: { userId: string }) {
    return this.authService.verifyEmail(body.userId);
  }

  @Post('confirm-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Email confirmed successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async confirmEmail(@Body() body: { userId: string, confirmationCode: string }) {
    return this.authService.confirmEmail(body.userId, body.confirmationCode);
  }

  @Post('resend-confirmation-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend confirmation code' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Confirmation code resent successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  async resendConfirmationCode(@Body() body: { userId: string }) {
    return this.authService.resendConfirmationCode(body.userId);
  }

}
