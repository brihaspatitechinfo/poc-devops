export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
    dialCodeId: string | null;
    phone: string;
    userId: string | null;
    gender: string;
    role: string;
    corporateCurrency: string;
    createCompanyPage: boolean;
    tags: string[];
    isActive: boolean;
    createdBy: string | null;
    organisationId: string | null;
    shouldReLogin: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface UserResponse {
    statusCode: number;
    message: string;
    data: User;
  }
  