import { Schema, model } from 'mongoose';
import { ISupplementItem } from './supplement.interface';

const SupplementItemSchema = new Schema<ISupplementItem>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    time: { type: String, required: true },
    purpose: { type: String, required: true },
    note: { type: String },
  },
  { timestamps: true }
);

export const SupplementItemModel = model<ISupplementItem>(
  'SupplementItem',
  SupplementItemSchema
);
