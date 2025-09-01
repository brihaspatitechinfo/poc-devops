import {
  AdminConfirmSignUpCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  AdminSetUserPasswordCommand,
  AuthFlowType,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  ResendConfirmationCodeCommand,
  SignUpCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CognitoConfig } from './cognito.config';

@Injectable()
export class CognitoService {
  constructor(private readonly cognitoConfig: CognitoConfig) { }

  async signUp(email: string, password: string, attributes: Record<string, string> = {}) {
    const command = new SignUpCommand({
      ClientId: this.cognitoConfig.getClientId(),
      Username: email,
      Password: password,
      SecretHash: this.cognitoConfig.calculateSecretHash(email),
      UserAttributes: Object.entries(attributes).map(([Name, Value]) => ({ Name, Value })),
    });

    try {
      const response = await this.cognitoConfig.getCognitoClient().send(command);
      return {
        userId: response.UserSub,
        userConfirmed: response.UserConfirmed,
        message: 'User registered successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Sign up failed: ${error.message}`);
    }
  }

  async confirmSignUp(email: string, confirmationCode: string) {
    const command = new ConfirmSignUpCommand({
      ClientId: this.cognitoConfig.getClientId(),
      Username: email,
      ConfirmationCode: confirmationCode,
      SecretHash: this.cognitoConfig.calculateSecretHash(email),
    });

    try {
      await this.cognitoConfig.getCognitoClient().send(command);
      return { message: 'User confirmed successfully' };
    } catch (error) {
      throw new BadRequestException(`Confirmation failed: ${error.message}`);
    }
  }

  async signIn(email: string, password: string) {
    const command = new InitiateAuthCommand({
      ClientId: this.cognitoConfig.getClientId(),
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.cognitoConfig.calculateSecretHash(email),
      },
    });

    try {
      const response = await this.cognitoConfig.getCognitoClient().send(command);

      if (response.AuthenticationResult) {
        return {
          accessToken: response.AuthenticationResult.AccessToken,
          refreshToken: response.AuthenticationResult.RefreshToken,
          idToken: response.AuthenticationResult.IdToken,
          expiresIn: response.AuthenticationResult.ExpiresIn,
          tokenType: 'Bearer',
        };
      } else if (response.ChallengeName) {
        return {
          challengeName: response.ChallengeName,
          session: response.Session,
          challengeParameters: response.ChallengeParameters,
        };
      }
    } catch (error) {
      throw new UnauthorizedException(`Sign in failed: ${error.message}`);
    }
  }

  async forgotPassword(email: string) {
    const command = new ForgotPasswordCommand({
      ClientId: this.cognitoConfig.getClientId(),
      Username: email,
      SecretHash: this.cognitoConfig.calculateSecretHash(email),
    });

    try {
      await this.cognitoConfig.getCognitoClient().send(command);
      return { message: 'Password reset code sent to email' };
    } catch (error) {
      throw new BadRequestException(`Forgot password failed: ${error.message}`);
    }
  }

  async confirmForgotPassword(email: string, confirmationCode: string, newPassword: string) {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: this.cognitoConfig.getClientId(),
      Username: email,
      ConfirmationCode: confirmationCode,
      Password: newPassword,
      SecretHash: this.cognitoConfig.calculateSecretHash(email),
    });

    try {
      await this.cognitoConfig.getCognitoClient().send(command);
      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new BadRequestException(`Password reset failed: ${error.message}`);
    }
  }

  async getUser(email: string) {
    const command = new AdminGetUserCommand({
      UserPoolId: this.cognitoConfig.getUserPoolId(),
      Username: email,
    });

    try {
      const response = await this.cognitoConfig.getCognitoClient().send(command);
      return {
        username: response.Username,
        attributes: response.UserAttributes?.reduce((acc, attr) => {
          if (attr.Name && attr.Value) {
            acc[attr.Name] = attr.Value;
          }
          return acc;
        }, {} as Record<string, string>),
        enabled: response.Enabled,
        userStatus: response.UserStatus,
        userCreateDate: response.UserCreateDate,
        userLastModifiedDate: response.UserLastModifiedDate,
      };
    } catch (error) {
      throw new BadRequestException(`Get user failed: ${error.message}`);
    }
  }

  async createUser(email: string, password: string, attributes: Record<string, string> = {}) {
    const command = new AdminCreateUserCommand({
      UserPoolId: this.cognitoConfig.getUserPoolId(),
      Username: email,
      TemporaryPassword: password,
      UserAttributes: Object.entries(attributes).map(([Name, Value]) => ({ Name, Value })),
      MessageAction: 'SUPPRESS', // Don't send welcome email
    });

    try {
      const response = await this.cognitoConfig.getCognitoClient().send(command);
      return {
        userId: response.User?.Username,
        userStatus: response.User?.UserStatus,
        message: 'User created successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Create user failed: ${error.message}`);
    }
  }

  async setUserPassword(email: string, password: string, permanent: boolean = true) {
    const command = new AdminSetUserPasswordCommand({
      UserPoolId: this.cognitoConfig.getUserPoolId(),
      Username: email,
      Password: password,
      Permanent: permanent,
    });

    try {
      await this.cognitoConfig.getCognitoClient().send(command);
      return { message: 'Password set successfully' };
    } catch (error) {
      throw new BadRequestException(`Set password failed: ${error.message}`);
    }
  }

  async deleteUser(email: string) {
    const command = new AdminDeleteUserCommand({
      UserPoolId: this.cognitoConfig.getUserPoolId(),
      Username: email,
    });

    try {
      await this.cognitoConfig.getCognitoClient().send(command);
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new BadRequestException(`Delete user failed: ${error.message}`);
    }
  }

  async refreshTokens(refreshToken: string) {
    const command = new InitiateAuthCommand({
      ClientId: this.cognitoConfig.getClientId(),
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        SECRET_HASH: this.cognitoConfig.calculateSecretHash(''), // Not needed for refresh
      },
    });

    try {
      const response = await this.cognitoConfig.getCognitoClient().send(command);

      if (response.AuthenticationResult) {
        return {
          accessToken: response.AuthenticationResult.AccessToken,
          idToken: response.AuthenticationResult.IdToken,
          expiresIn: response.AuthenticationResult.ExpiresIn,
          tokenType: 'Bearer',
        };
      }
    } catch (error) {
      throw new BadRequestException(`Token refresh failed: ${error.message}`);
    }
  }

  async verifyEmail(userId: string): Promise<void> {
    const command = new AdminConfirmSignUpCommand({
      Username: userId,
      UserPoolId: this.cognitoConfig.getUserPoolId(),
    });
    try {
      await this.cognitoConfig.getCognitoClient().send(command);
    } catch (error) {
      throw new BadRequestException(`Email verification failed: ${error.message}`);
    }
  }

  async confirmEmail(userId: string, confirmationCode: string): Promise<{ message: string }> {
    const command = new ConfirmSignUpCommand({
      ClientId: this.cognitoConfig.getClientId(),
      Username: userId,
      ConfirmationCode: confirmationCode
      // SecretHash: this.cognitoConfig.calculateSecretHash(userId),
    });
    try {
      await this.cognitoConfig.getCognitoClient().send(command);
      return { message: 'Email confirmed successfully' };
    } catch (error) {
      throw new BadRequestException(`Confirm email failed: ${error.message}`);
    }
  }

  async resendConfirmationCode(userId: string) {
    const command = new ResendConfirmationCodeCommand({
      ClientId: this.cognitoConfig.getClientId(),
      Username: userId,
    });
    try {
      const response = await this.cognitoConfig.getCognitoClient().send(command);
      return {
        message: 'Confirmation code resent successfully',
        deliveryDetails: response.CodeDeliveryDetails,
      };
    } catch (error) {
      throw new Error(`Failed to resend confirmation code: ${error.message}`);
    }
  }





} 