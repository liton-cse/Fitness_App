"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Sub-schema for question and answer
const QuestionAnswerSchema = new mongoose_1.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
});
// Sub-schema for well-being
const WellBeingSchema = new mongoose_1.Schema({
    energyLevel: { type: Number, required: true },
    stressLevel: { type: Number, required: true },
    moodLevel: { type: Number, required: true },
    sleepQuality: { type: Number, required: true },
});
// Sub-schema for nutrition
const NutritionSchema = new mongoose_1.Schema({
    dietLevel: { type: Number, required: true },
    digestionLevel: { type: Number, required: true },
    challengeDiet: { type: String, required: true },
});
// Sub-schema for training
const TrainingSchema = new mongoose_1.Schema({
    feelStrength: { type: Number, required: true },
    pumps: { type: Number, required: true },
    cardioCompleted: { type: Boolean, required: true },
    trainingCompleted: { type: Boolean, required: true },
});
// Main Check-in Schema
const CheckInSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    currentWeight: { type: Number, required: true },
    averageWeight: { type: Number, required: true },
    questionAndAnswer: { type: [QuestionAnswerSchema], required: true },
    wellBeing: { type: WellBeingSchema, required: true },
    nutrition: { type: NutritionSchema, required: true },
    training: { type: TrainingSchema, required: true },
    trainingFeedback: { type: String, required: true },
    dailyNote: { type: String, required: true },
    image: { type: [String], default: [] },
    video: { type: [String], default: [] },
}, { timestamps: true });
// Model
const CheckInModel = (0, mongoose_1.model)('CheckIn', CheckInSchema);
exports.default = CheckInModel;
