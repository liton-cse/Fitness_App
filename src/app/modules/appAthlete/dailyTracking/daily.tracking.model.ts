import { Schema, Types, model } from 'mongoose';
import {
  DailyTracking,
  TRAINING_PLAN_VALUES,
  CARDIO_TYPE_VALUES,
  CYCLE_PHASE_VALUES,
  WOMEN_SYMPTOMS_VALUES,
} from './daily.tracking.interface';

// =====================
// SUB SCHEMAS
// =====================

const EnergyAndWellBeingSchema = new Schema(
  {
    energyLevel: { type: Number, required: true },
    stressLevel: { type: Number, required: true },
    muscelLevel: { type: Number, required: true },
    mood: { type: Number, required: true },
    motivation: { type: Number, required: true },
    bodyTemperature: { type: String, required: true },
  },
  { _id: false }
);

const TrainingSchema = new Schema(
  {
    trainingCompleted: { type: Boolean, required: true },

    trainingPlan: {
      type: [String],
      enum: TRAINING_PLAN_VALUES,
      required: true,
    },

    cardioCompleted: { type: Boolean, required: true },

    cardioType: {
      type: String,
      enum: CARDIO_TYPE_VALUES,
      required: true,
    },

    duration: { type: String, required: true },
  },
  { _id: false }
);

const NutritionSchema = new Schema(
  {
    calories: { type: Number, required: true },
    carbs: { type: Number, required: true },
    protein: { type: Number, required: true },
    fats: { type: Number, required: true },
    hungerLevel: { type: Number, required: true },
    digestionLevel: { type: Number, required: true },
    salt: { type: Number, required: true },
  },
  { _id: false }
);

const WomanHealthSchema = new Schema(
  {
    cyclePhase: {
      type: String,
      enum: CYCLE_PHASE_VALUES,
      required: true,
    },

    cycleDay: { type: String, required: true },
    pmsSymptoms: { type: Number, required: true },
    cramps: { type: Number, required: true },

    symptoms: {
      type: [String],
      enum: WOMEN_SYMPTOMS_VALUES,
      required: true,
    },
  },
  { _id: false }
);

const MedicationSchema = new Schema(
  {
    dailyDosage: { type: String, required: true },
    sideEffect: { type: String, required: true },
  },
  { _id: false }
);

const BloodPressureSchema = new Schema(
  {
    systolic: { type: String, required: true },
    diastolic: { type: String, required: true },
    restingHeartRate: { type: String, required: true },
    bloodGlucose: { type: String, required: true },
  },
  { _id: false }
);

// =====================
// MAIN SCHEMA
// =====================

const DailyTrackingSchema = new Schema<DailyTracking>(
  {
    date: { type: String, required: true },
    userId: {
      type: Types.ObjectId,
      ref: 'Athlete',
      required: true,
    },
    weight: { type: Number, required: true },
    sleepHour: { type: Number, required: true },
    sleepQuality: { type: String, required: true },
    sick: { type: Boolean, required: true },
    water: { type: String, required: true },

    energyAndWellBeing: {
      type: EnergyAndWellBeingSchema,
      required: true,
    },

    training: {
      type: TrainingSchema,
      required: true,
    },

    activityStep: { type: Number, required: true },

    nutrition: {
      type: NutritionSchema,
      required: true,
    },

    woman: {
      type: WomanHealthSchema,
      required: true,
    },

    ped: {
      type: MedicationSchema,
      required: true,
    },

    bloodPressure: {
      type: BloodPressureSchema,
      required: true,
    },

    dailyNotes: { type: String, required: true },
  },
  { timestamps: true }
);

DailyTrackingSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyTrackingModel = model<DailyTracking>(
  'DailyTracking',
  DailyTrackingSchema
);
