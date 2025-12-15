"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AthleteNutritionPlanModel = void 0;
const mongoose_1 = require("mongoose");
// Sub-schema for IFood
const foodSchema = new mongoose_1.Schema({
    foodName: { type: String, required: true },
    quantity: { type: Number, required: true },
}, { _id: false });
const athleteNutritionPlanSchema = new mongoose_1.Schema({
    athleteId: { type: String, required: true },
    mealName: { type: String, required: true },
    food: { type: [foodSchema], required: true },
    time: { type: String, required: true },
    trainingDay: { type: String, required: true },
}, {
    timestamps: true,
});
exports.AthleteNutritionPlanModel = (0, mongoose_1.model)('AthleteNutritionPlan', athleteNutritionPlanSchema);
