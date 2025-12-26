import { Types } from 'mongoose';

export interface QuestionAnswer {
  question: string;
  answer: string;
}

export interface WellBeing {
  energyLevel: number;
  stressLevel: number;
  moodLevel: number;
  sleepQuality: number;
}

export interface Nutrition {
  dietLevel: number;
  digestionLevel: number;
  challengeDiet: string;
}

export interface Training {
  feelStrength: number;
  pumps: number;
  cardioCompleted: boolean;
  trainingCompleted: boolean;
}

export interface ICheckInInfo {
  userId: Types.ObjectId;
  coachId?: string;
  currentWeight: number;
  averageWeight: number;
  questionAndAnswer: QuestionAnswer[];
  wellBeing: WellBeing;
  nutrition: Nutrition;
  training: Training;
  trainingFeedback: string;
  dailyNote: string;
  image: string[];
  video: string[];
  checkInComplete?: boolean;
}
