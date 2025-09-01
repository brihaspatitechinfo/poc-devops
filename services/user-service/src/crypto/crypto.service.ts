import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly secretKey: Buffer;
  constructor(private readonly configService: ConfigService) {
    this.secretKey = crypto
      .createHash('sha256')
      .update(
        this.configService.get('CRYPTO_KEY') || 'FrLc1az4GispZUfO3EGEw0ylfi',
      )
      .digest();
  }
  
  async encrypt(plainText: string): Promise<string> {
    try {
      const cipher = crypto.createCipheriv('aes-256-ecb', this.secretKey, null);
      let encrypted = cipher.update(plainText, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      return encrypted;
    } catch (error) {
      throw new Error(`Failed to encrypt data: ${error.message}`);
    }
  }

  async decrypt(encryptedBase64: string): Promise<string> {
    try {
      const decipher = crypto.createDecipheriv('aes-256-ecb', this.secretKey, null);
      let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      throw new Error(`Failed to decrypt data: ${error.message}`);
    }
  }
}
