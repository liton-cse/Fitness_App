import { USER_ROLES } from '../../../../enums/user';

export interface ICoach {
  name: string;
  role: USER_ROLES;
  email: string;
  password: string;
  image?: string;
  verified: boolean;
  isActive: 'Active' | 'In-Active';
  lastActive?: Date;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
}
