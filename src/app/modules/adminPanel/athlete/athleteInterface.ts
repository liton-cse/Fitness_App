import { Model } from 'mongoose';
import { USER_ROLES } from '../../../../enums/user';

export interface IAthlete {
  name: string;
  email: string;
  role: USER_ROLES;
  password: string;
  gender: 'Male' | 'Female';
  category: string;
  phase: string;
  weight: number;
  height: number;
  water: number;
  image?: string;
  age: number;
  status: 'Natural' | 'Enhanced';
  trainingDaySteps: number;
  restDaySteps: number;
  checkInDay: string;
  goal: string;
  verified: boolean;
  lastCheckIn?: Date;
  isActive: 'Active' | 'In-Active';
  lastActive?: Date;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
}

export type AthleteType = {
  isExistAthleteById(id: string): any;
  isExistAthleteByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IAthlete>;
