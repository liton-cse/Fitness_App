import { Schema, model } from 'mongoose';
import { ICoach } from './coachInterface';

const userSchema = new Schema<ICoach>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },

    isActive: {
      type: String,
      enum: ['Active', 'In-Active'],
      default: 'Active',
    },

    lastActive: { type: Date },
  },
  { timestamps: true }
);

export const CoachModel = model<ICoach>('Coach', userSchema);
