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
  rep: {
    type: String,
    required: true,
  },
  range: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    default: '',
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
  },
  {
    timestamps: true,
  }
);

export const TrainingPlanModel = mongoose.model<ITrainingPlan>(
  'TrainingPlanForAthlete',
  TrainingPlanSchema
);
