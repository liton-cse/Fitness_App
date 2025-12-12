import { Schema, model } from 'mongoose';
import { IPEDInfo } from './ped.interface';

const DosageInfoSchema = new Schema(
  {
    dosage: { type: String },
    frequency: { type: String },
    mon: { type: String },
    tue: { type: String },
    wed: { type: String },
    thu: { type: String },
    fri: { type: String },
    sat: { type: String },
    sun: { type: String },
  },
  { _id: false }
);

const PEDInfoSchema = new Schema<IPEDInfo>(
  {
    week: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },

    ped: { type: DosageInfoSchema, required: true },
  },
  {
    timestamps: true,
  }
);

export const PEDInfoModel = model<IPEDInfo>('PEDInfo', PEDInfoSchema);
