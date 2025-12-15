"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseModel = void 0;
const mongoose_1 = require("mongoose");
const exercise_interface_1 = require("./exercise.interface");
const ExerciseSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    musal: { type: String, required: true },
    difficulty: { type: String, required: true },
    equipment: { type: String, required: true },
    description: { type: String, required: true },
    subCategory: {
        type: [String],
        enum: Object.values(exercise_interface_1.MuscleCategory),
        required: true,
    },
    image: { type: String, required: true },
    vedio: { type: String, required: true },
}, { timestamps: true });
exports.ExerciseModel = (0, mongoose_1.model)('Exercise', ExerciseSchema);
