"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseService = void 0;
const exercise_model_1 = require("./exercise.model");
class ExerciseService {
    async createExercise(data) {
        return await exercise_model_1.ExerciseModel.create(data);
    }
    async getAllExercises(page, limit, search, musalCategory) {
        const skip = (page - 1) * limit;
        const filter = {};
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }
        if (musalCategory) {
            filter.musal = musalCategory;
        }
        const exercises = await exercise_model_1.ExerciseModel.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await exercise_model_1.ExerciseModel.countDocuments(filter);
        return {
            meta: {
                total,
                page,
                limit,
            },
            exercises,
        };
    }
    async getExerciseById(id) {
        return await exercise_model_1.ExerciseModel.findById(id);
    }
    async updateExercise(id, data) {
        return await exercise_model_1.ExerciseModel.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteExercise(id) {
        return await exercise_model_1.ExerciseModel.findByIdAndDelete(id);
    }
}
exports.ExerciseService = ExerciseService;
