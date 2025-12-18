import { Types } from 'mongoose';

export interface ITimeLine {
  userId: string;
  coachId: Types.ObjectId;
  phase: string;
}
