import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ValidateCohortExcelDto } from './validate-cohort-excel.dto';

describe('ValidateCohortExcelDto', () => {
  const createValidDto = () => ({
    'First Name*': 'John',
    'Last Name*': 'Doe',
    'Email*': 'john.doe@example.com',
    'Country Dial Code*': '+1',
    'Phone No*': '1234567890',
    'Gender*': 'Male',
    'Total Years of Experience*': 5,
    'Country*': 'USA',
    'Level*': 'Senior',
  });

  describe('firstName validation', () => {
    it('should reject empty firstName', () => {
      const invalidData = {
        ...createValidDto(),
        'First Name*': '',
      };
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, invalidData);
      const errors = validateSync(dtoInstance);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('First Name*');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should accept valid firstName', () => {
      const validData = createValidDto();
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, validData);
      const errors = validateSync(dtoInstance);
      expect(errors).toHaveLength(0);
    });
  });

  describe('lastName validation', () => {
    it('should reject empty lastName', () => {
      const invalidData = {
        ...createValidDto(),
        'Last Name*': '',
      };
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, invalidData);
      const errors = validateSync(dtoInstance);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('Last Name*');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should accept valid lastName', () => {
      const validData = createValidDto();
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, validData);
      const errors = validateSync(dtoInstance);
      expect(errors).toHaveLength(0);
    });
  });

  describe('email validation', () => {
    it('should reject empty email', () => {
      const invalidData = {
        ...createValidDto(),
        'Email*': '',
      };
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, invalidData);
      const errors = validateSync(dtoInstance);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('Email*');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        ...createValidDto(),
        'Email*': 'invalid-email',
      };
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, invalidData);
      const errors = validateSync(dtoInstance);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('Email*');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should accept valid email', () => {
      const validData = createValidDto();
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, validData);
      const errors = validateSync(dtoInstance);
      expect(errors).toHaveLength(0);
    });
  });

  describe('countryDialCode validation', () => {
    it('should reject empty countryDialCode', () => {
      const invalidData = {
        ...createValidDto(),
        'Country Dial Code*': '',
      };
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, invalidData);
      const errors = validateSync(dtoInstance);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('Country Dial Code*');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should accept valid country dial codes', () => {
      const validDialCodes = ['+1', '+44', '+91', '+86'];
      validDialCodes.forEach(dialCode => {
        const validData = {
          ...createValidDto(),
          'Country Dial Code*': dialCode,
        };
        const dtoInstance = plainToInstance(ValidateCohortExcelDto, validData);
        const errors = validateSync(dtoInstance);
        expect(errors).toHaveLength(0);
      });
    });
  });

  describe('phoneNo validation', () => {
    it('should reject empty phoneNo', () => {
      const invalidData = {
        ...createValidDto(),
        'Phone No*': '',
      };
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, invalidData);
      const errors = validateSync(dtoInstance);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('Phone No*');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should accept valid phone numbers', () => {
      const validPhoneNumbers = ['1234567890', '9876543210', '5551234567'];
      validPhoneNumbers.forEach(phone => {
        const validData = {
          ...createValidDto(),
          'Phone No*': phone,
        };
        const dtoInstance = plainToInstance(ValidateCohortExcelDto, validData);
        const errors = validateSync(dtoInstance);
        expect(errors).toHaveLength(0);
      });
    });
  });

  describe('gender validation', () => {
    it('should reject empty gender', () => {
      const invalidData = {
        ...createValidDto(),
        'Gender*': '',
      };
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, invalidData);
      const errors = validateSync(dtoInstance);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('Gender*');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should accept valid gender values', () => {
      const validGenders = ['Male', 'Female', 'Other'];
      validGenders.forEach(gender => {
        const validData = {
          ...createValidDto(),
          'Gender*': gender,
        };
        const dtoInstance = plainToInstance(ValidateCohortExcelDto, validData);
        const errors = validateSync(dtoInstance);
        expect(errors).toHaveLength(0);
      });
    });
  });

  describe('totalYearsOfExperience validation', () => {
    it('should reject non-number values', () => {
      const invalidData = {
        ...createValidDto(),
        'Total Years of Experience*': 'five',
      };
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, invalidData);
      const errors = validateSync(dtoInstance);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('Total Years of Experience*');
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should reject undefined totalYearsOfExperience', () => {
      const invalidData = {
        ...createValidDto(),
        'Total Years of Experience*': undefined,
      };
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, invalidData);
      const errors = validateSync(dtoInstance);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('Total Years of Experience*');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should accept valid number values', () => {
      const validNumbers = [0, 1, 5, 10, 20];
      validNumbers.forEach(number => {
        const validData = {
          ...createValidDto(),
          'Total Years of Experience*': number,
        };
        const dtoInstance = plainToInstance(ValidateCohortExcelDto, validData);
        const errors = validateSync(dtoInstance);
        expect(errors).toHaveLength(0);
      });
    });
  });

  describe('country validation', () => {
    it('should reject empty country', () => {
      const invalidData = {
        ...createValidDto(),
        'Country*': '',
      };
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, invalidData);
      const errors = validateSync(dtoInstance);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('Country*');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should accept valid country names', () => {
      const validCountries = ['USA', 'UK', 'India', 'Canada'];
      validCountries.forEach(country => {
        const validData = {
          ...createValidDto(),
          'Country*': country,
        };
        const dtoInstance = plainToInstance(ValidateCohortExcelDto, validData);
        const errors = validateSync(dtoInstance);
        expect(errors).toHaveLength(0);
      });
    });
  });

  describe('level validation', () => {
    it('should reject empty level', () => {
      const invalidData = {
        ...createValidDto(),
        'Level*': '',
      };
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, invalidData);
      const errors = validateSync(dtoInstance);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('Level*');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should accept valid level values', () => {
      const validLevels = ['Junior', 'Mid', 'Senior', 'Lead'];
      validLevels.forEach(level => {
        const validData = {
          ...createValidDto(),
          'Level*': level,
        };
        const dtoInstance = plainToInstance(ValidateCohortExcelDto, validData);
        const errors = validateSync(dtoInstance);
        expect(errors).toHaveLength(0);
      });
    });
  });

  describe('optional fields validation', () => {
    it('should accept all optional fields when present', () => {
      const validData = {
        ...createValidDto(),
        industryType: 'IT',
        functionalArea: 'Engineering',
        currentRoleOrDesignation: 'Developer',
        businessAndTechSkills: 'Node.js, React',
        softSkills: 'Communication, Teamwork',
        linkedInLink: 'https://linkedin.com/in/test',
      };
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, validData);
      const errors = validateSync(dtoInstance);
      expect(errors).toHaveLength(0);
    });

    it('should accept when all optional fields are empty strings', () => {
      const validData = {
        ...createValidDto(),
        industryType: '',
        functionalArea: '',
        currentRoleOrDesignation: '',
        businessAndTechSkills: '',
        softSkills: '',
        linkedInLink: '',
      };
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, validData);
      const errors = validateSync(dtoInstance);
      expect(errors).toHaveLength(0);
    });

    it('should accept when all optional fields are missing', () => {
      const validData = createValidDto();
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, validData);
      const errors = validateSync(dtoInstance);
      expect(errors).toHaveLength(0);
    });
  });

  describe('multiple validation errors', () => {
    it('should capture all validation errors for invalid data', () => {
      const invalidData = {
        'First Name*': '',
        'Last Name*': '',
        'Email*': 'invalid-email',
        'Country Dial Code*': '',
        'Phone No*': '',
        'Gender*': '',
        'Total Years of Experience*': 'not-a-number',
        'Country*': '',
        'Level*': '',
      };
      
      const dtoInstance = plainToInstance(ValidateCohortExcelDto, invalidData);
      const errors = validateSync(dtoInstance);
      
      expect(errors.length).toBeGreaterThan(0);
      
      const errorProperties = errors.map(error => error.property);
      expect(errorProperties).toContain('First Name*');
      expect(errorProperties).toContain('Last Name*');
      expect(errorProperties).toContain('Email*');
      expect(errorProperties).toContain('Country Dial Code*');
      expect(errorProperties).toContain('Phone No*');
      expect(errorProperties).toContain('Gender*');
      expect(errorProperties).toContain('Total Years of Experience*');
      expect(errorProperties).toContain('Country*');
      expect(errorProperties).toContain('Level*');
    });
  });
}); 