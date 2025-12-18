import { Schema, model, Types, Document } from 'mongoose';

export interface ITimeLine extends Document {
  userId: string;
  coachId: Types.ObjectId;
  phase: string;
}

const TimeLineSchema = new Schema<ITimeLine>(
  {
    userId: { type: String, required: true },
    coachId: { type: Types.ObjectId, ref: 'Coach', required: true },
    phase: { type: String, required: true },
  },
  { timestamps: true }
);

export const TimeLineModel = model<ITimeLine>('TimeLine', TimeLineSchema);
