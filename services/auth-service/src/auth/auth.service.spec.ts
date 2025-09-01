import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CognitoService } from './cognito.service';
import { RegisterDto, UserRole, Gender } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CognitoConfig } from './cognito.config';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let cognitoService: CognitoService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: CognitoService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
            forgotPassword: jest.fn(),
            confirmForgotPassword: jest.fn(),
            verifyToken: jest.fn(),
            refreshTokens: jest.fn(),
          },
        },
        {
          provide: CognitoConfig,
          useValue: {
            getCognitoClient: jest.fn(),
            getUserPoolId: jest.fn(),
            getClientId: jest.fn(),
            getClientSecret: jest.fn(),
            getRegion: jest.fn(),
            calculateSecretHash: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    cognitoService = module.get<CognitoService>(CognitoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'raj@we-ace.com',
        password: 'SecurePass123!',
        firstName: 'Raj Kamal',
        lastName: 'Chaurasiya',
        role: UserRole.COACH,
        phone: '7503195001',
        gender: Gender.MALE,
      };

      const expectedResult = {
        userId: 'test-user-id',
        userConfirmed: false,
        message: 'User registered successfully',
      };

      jest.spyOn(cognitoService, 'signUp').mockResolvedValue(expectedResult);
      const result = await service.register(registerDto);

      expect(result).toEqual(expectedResult);
      expect(cognitoService.signUp).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        {
          'email': registerDto.email,
          'given_name': registerDto.firstName,
          'family_name': registerDto.lastName,
          'phone_number': registerDto.phone,
          'gender': registerDto.gender,
        }
      );
    });

    it('should throw ConflictException when user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'raj@we-ace.com',
        password: 'SecurePass123!',
        firstName: 'Raj Kamal',
        lastName: 'Chaurasiya',
        role: UserRole.COACH,
        phone: '7503195001',
        gender: Gender.MALE,
      };

      jest.spyOn(cognitoService, 'signUp').mockRejectedValue(new ConflictException('Email already exists'));

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto: LoginDto = {
        email: 'raj@we-ace.com',
        password: 'SecurePass123!',
      };

      const expectedResult = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        idToken: 'mock-id-token',
        expiresIn: 3600,
        tokenType: 'Bearer',
      };

      jest.spyOn(cognitoService, 'signIn').mockResolvedValue(expectedResult);
      const result = await service.login(loginDto);
      expect(result).toEqual(expectedResult);
      expect(cognitoService.signIn).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    });

    it('should throw UnauthorizedException if CognitoService.signIn throws UnauthorizedException', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      jest.spyOn(cognitoService, 'signIn').mockRejectedValue(new UnauthorizedException());
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(cognitoService.signIn).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    });

  });
});
