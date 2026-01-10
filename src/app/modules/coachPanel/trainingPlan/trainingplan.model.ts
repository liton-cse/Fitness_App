import mongoose, { Schema, Types } from 'mongoose';
import { IExercise, ITrainingPlan } from './trainingplan.interface';

/* Exercise Sub Schema */
const ExerciseSchema = new Schema<IExercise>({
  exerciseName: {
    type: String,
    required: true,
    trim: true,
  },
  sets: {
    type: String,
    required: true,
  },
  repRange: {
    type: String,
    required: true,
  },
  rir: {
    type: String,
    required: true,
  },
  excerciseNote: {
    type: String,
    required: true,
  },
});

/* Training Plan Schema */
const TrainingPlanSchema = new Schema<ITrainingPlan>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    coachId: {
      type: Types.ObjectId,
      ref: 'Coach',
      required: true,
    },
    traingPlanName: {
      type: String,
      required: true,
      trim: true,
    },
    exercise: {
      type: [ExerciseSchema],
      required: true,
    },
    dificulty: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const TrainingPlanModel = mongoose.model<ITrainingPlan>(
  'TrainingPlanForAthlete',
  TrainingPlanSchema
);
