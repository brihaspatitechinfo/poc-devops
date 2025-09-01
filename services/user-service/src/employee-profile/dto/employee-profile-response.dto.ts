import { ApiProperty } from '@nestjs/swagger';

export class EmployeeProfileResponseDto {
    @ApiProperty({
        example: '507f1f77bcf86cd799439011',
        description: 'Unique identifier for the employee profile',
    })
    _id: string;

    @ApiProperty({
        example: 1,
        description: 'The user ID',
    })
    userId: number;

    @ApiProperty({
        example: 'Tech Solutions Inc.',
        description: 'Organization name',
        required: false,
    })
    organizationName?: string;

    @ApiProperty({
        example: 'tech-solutions-inc',
        description: 'Unique organization slug',
        required: false,
    })
    orgSlug?: string;

    @ApiProperty({
        example: 'provider123',
        description: 'Training provider ID',
        required: false,
    })
    trainingProviderId?: string;

    @ApiProperty({
        example: 49,
        description: 'Corporate currency code',
        default: 49,
    })
    corporateCurrency: number;

    @ApiProperty({
        example: 'Leading technology solutions provider',
        description: 'Organization description',
        required: false,
    })
    description?: string;

    @ApiProperty({
        example: 'Senior Manager',
        description: 'Designation in the organization',
        required: false,
    })
    designation?: string;

    @ApiProperty({
        example: '22AAAAA0000A1Z5',
        description: 'GST number',
        required: false,
    })
    gstNumber?: string;

    @ApiProperty({
        example: 'ABCDE1234F',
        description: 'PAN number',
        required: false,
    })
    panNumber?: string;

    @ApiProperty({
        example: 101,
        description: 'Organization phone dial ID',
        default: 101,
    })
    orgPhoneDialId: number;

    @ApiProperty({
        example: '9876543210',
        description: 'Organization phone number',
        required: false,
    })
    organizationPhone?: string;

    @ApiProperty({
        example: 5,
        description: 'Number of recruiters',
        default: 2,
    })
    numRecruiters: number;

    @ApiProperty({
        example: 'https://example.com/logo.png',
        description: 'Organization image URL',
        required: false,
    })
    image?: string;

    @ApiProperty({
        example: '123 Main Street, Tech Park',
        description: 'Organization address',
        required: false,
    })
    address?: string;

    @ApiProperty({
        example: '400001',
        description: 'ZIP code',
        required: false,
    })
    zipCode?: string;

    @ApiProperty({
        example: 1,
        description: 'Country ID',
        required: false,
    })
    countryId?: number;

    @ApiProperty({
        example: 1,
        description: 'State ID',
        required: false,
    })
    stateId?: number;

    @ApiProperty({
        example: 1,
        description: 'City ID',
        required: false,
    })
    cityId?: number;

    @ApiProperty({
        example: 'contact@techsolutions.com',
        description: 'Alternate email address',
        required: false,
    })
    alternateEmail?: string;

    @ApiProperty({
        example: false,
        description: 'Create page flag',
        default: false,
    })
    createPage: boolean;

    @ApiProperty({
        example: false,
        description: 'Page active status',
        default: false,
    })
    pageActiveStatus: boolean;

    @ApiProperty({
        example: 'Innovative tech solutions',
        description: 'Short description',
        required: false,
    })
    shortDescription?: string;

    @ApiProperty({
        example: 'Software development, Cloud solutions, AI services',
        description: 'Products and services',
        required: false,
    })
    productsServices?: string;

    @ApiProperty({
        example: 'Innovation-driven culture with flexible policies',
        description: 'Culture and policies',
        required: false,
    })
    culturePolicies?: string;

    @ApiProperty({
        example: 'https://techsolutions.com',
        description: 'Website URL',
        required: false,
    })
    website?: string;

    @ApiProperty({
        example: 'https://youtube.com/watch?v=example',
        description: 'Video link',
        required: false,
    })
    videoLink?: string;

    @ApiProperty({
        example: 1,
        description: 'User who created the profile',
        required: false,
    })
    createdBy?: number;

    @ApiProperty({
        example: 1,
        description: 'User who last updated the profile',
        required: false,
    })
    updatedBy?: number;

    @ApiProperty({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Creation timestamp',
    })
    createdAt: Date;

    @ApiProperty({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Last update timestamp',
    })
    updatedAt: Date;
} 