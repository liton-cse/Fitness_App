import { Schema, model, Document, Query } from 'mongoose';
import { IShowManagement } from './management.interface';
// Calculate countdown in days
const calculateCountdown = (dateStr: string) => {
  const showDate = new Date(dateStr);
  const now = new Date();
  const diffMs = showDate.getTime() - now.getTime();
  if (diffMs <= 0) return 0;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

const ShowManagementSchema = new Schema<IShowManagement>(
  {
    name: { type: String, required: true },
    division: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    countdown: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook
ShowManagementSchema.pre<IShowManagement>('save', function () {
  this.countdown = calculateCountdown(this.date);
});

// Pre-findOneAndUpdate hook
ShowManagementSchema.pre<Query<IShowManagement, IShowManagement>>(
  'findOneAndUpdate',
  function () {
    const update = this.getUpdate() as Record<string, any> | undefined;

    if (update && typeof update === 'object' && update.date) {
      update.countdown = calculateCountdown(update.date);
      this.set(update);
    }
  }
);

export const ShowManagementModel = model<IShowManagement>(
  'ShowManagement',
  ShowManagementSchema
);
