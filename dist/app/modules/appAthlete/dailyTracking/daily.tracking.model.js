"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyTrackingModel = void 0;
const mongoose_1 = require("mongoose");
const daily_tracking_interface_1 = require("./daily.tracking.interface");
// =====================
// SUB SCHEMAS
// =====================
const EnergyAndWellBeingSchema = new mongoose_1.Schema({
    energyLevel: { type: Number, required: true },
    stressLevel: { type: Number, required: true },
    muscelLevel: { type: Number, required: true },
    mood: { type: Number, required: true },
    motivation: { type: Number, required: true },
    bodyTemperature: { type: String, required: true },
}, { _id: false });
const TrainingSchema = new mongoose_1.Schema({
    traningCompleted: { type: Boolean, required: true },
    trainingPlan: {
        type: [String],
        enum: daily_tracking_interface_1.TRAINING_PLAN_VALUES,
        required: true,
    },
    cardioCompleted: { type: Boolean, required: true },
    cardioType: {
        type: String,
        enum: daily_tracking_interface_1.CARDIO_TYPE_VALUES,
        required: true,
    },
    duration: { type: String, required: true },
}, { _id: false });
const NutritionSchema = new mongoose_1.Schema({
    calories: { type: Number, required: true },
    carbs: { type: Number, required: true },
    protein: { type: Number, required: true },
    fats: { type: Number, required: true },
    hungerLevel: { type: Number, required: true },
    digestionLevel: { type: Number, required: true },
    salt: { type: Number, required: true },
}, { _id: false });
const WomanHealthSchema = new mongoose_1.Schema({
    cyclePhase: {
        type: String,
        enum: daily_tracking_interface_1.CYCLE_PHASE_VALUES,
        required: true,
    },
    cycleDay: { type: String, required: true },
    pmsSymptoms: { type: Number, required: true },
    cramps: { type: Number, required: true },
    symptoms: {
        type: [String],
        enum: daily_tracking_interface_1.WOMEN_SYMPTOMS_VALUES,
        required: true,
    },
}, { _id: false });
const MedicationSchema = new mongoose_1.Schema({
    dailyDosage: { type: String, required: true },
    sideEffect: { type: String, required: true },
}, { _id: false });
const BloodPressureSchema = new mongoose_1.Schema({
    systolic: { type: String, required: true },
    diastolic: { type: String, required: true },
    restingHeartRate: { type: String, required: true },
    bloodGlucose: { type: String, required: true },
}, { _id: false });
// =====================
// MAIN SCHEMA
// =====================
const DailyTrackingSchema = new mongoose_1.Schema({
    date: { type: String, required: true },
    userId: {
        type: mongoose_1.Types.ObjectId,
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
}, { timestamps: true });
DailyTrackingSchema.index({ userId: 1, date: 1 }, { unique: true });
exports.DailyTrackingModel = (0, mongoose_1.model)('DailyTracking', DailyTrackingSchema);
