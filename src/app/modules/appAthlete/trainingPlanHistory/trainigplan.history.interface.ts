import { Types } from 'mongoose';
export interface ITime {
  hour: string;
  minite: string;
}
export interface IPushData {
  weight: number;
  reps: number;
  rir: number;
}

export interface ITrainingPushDayHistory {
  userId: Types.ObjectId;
  trainingName: string;
  time: ITime;
  pushData: IPushData[];
  note: string;
}
