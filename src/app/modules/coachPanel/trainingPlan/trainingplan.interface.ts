import { Types } from 'mongoose';

export interface IExercise {
  _id: string;
  exerciseName: string;
  sets: string;
  rep: string;
  range: string;
  comment: string;
}
export interface ITrainingPlan extends Document {
  userId: string;
  coachId: Types.ObjectId;
  traingPlanName: string;
  exercise: IExercise[];
  dificulty: string;
}
