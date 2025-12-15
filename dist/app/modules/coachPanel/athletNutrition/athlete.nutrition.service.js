"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AthleteNutritionPlanService = void 0;
const calculate_total_nutrition_1 = require("../../../../util/calculate.total.nutrition");
const food_model_1 = require("../../adminPanel/nutrition/Food/food.model");
const athlete_nutrition_model_1 = require("./athlete.nutrition.model");
class AthleteNutritionPlanService {
    /**
     * Create a new nutrition plan
     */
    async createNutritionPlan(payload) {
        const result = await athlete_nutrition_model_1.AthleteNutritionPlanModel.create(payload);
        return result;
    }
    /**
     * Get all nutrition plans with optional search & filter
     */
    async getNutritionPlans(filters, athleteId) {
        const query = {};
        if (filters.mealName) {
            query.mealName = { $regex: filters.mealName, $options: 'i' };
        }
        if (filters.trainingDay) {
            query.trainingDay = filters.trainingDay;
        }
        const plans = await athlete_nutrition_model_1.AthleteNutritionPlanModel.find({
            athleteId,
            ...query,
        }).sort({ createdAt: -1 });
        if (!plans.length)
            return [];
        const foodNames = [
            ...new Set(plans.flatMap(plan => plan.food.map(food => food.foodName))),
        ];
        const foodItems = await food_model_1.FoodItemModel.find({
            name: { $in: foodNames },
        });
        const foodMap = new Map(foodItems.map(food => [food.name, food]));
        const enrichedPlans = plans.map(plan => {
            let totalProtein = 0;
            let totalFats = 0;
            let totalCarbs = 0;
            let totalCalories = 0;
            plan.food.forEach(food => {
                const foodItem = foodMap.get(food.foodName);
                if (!foodItem)
                    return;
                const defaultQty = Number(foodItem.defaultQuantity.replace('g', '')) || 1;
                const macros = (0, calculate_total_nutrition_1.calculateMacrosByQuantity)({
                    caloriesQuantity: foodItem.caloriesQuantity,
                    proteinQuantity: foodItem.proteinQuantity,
                    fatsQuantity: foodItem.fatsQuantity,
                    carbsQuantity: foodItem.carbsQuantity,
                    defaultQuantity: defaultQty,
                }, food.quantity);
                totalProtein += macros.protein;
                totalFats += macros.fats;
                totalCarbs += macros.carbs;
                totalCalories += macros.calories;
            });
            return {
                ...plan.toObject(),
                totalProtein: Number(totalProtein.toFixed(2)),
                totalFats: Number(totalFats.toFixed(2)),
                totalCarbs: Number(totalCarbs.toFixed(2)),
                totalCalories: Number(totalCalories.toFixed(2)),
            };
        });
        // ✅ NEW: calculate grand totals
        const totals = (0, calculate_total_nutrition_1.calculateTotalNutritionFromPlans)(enrichedPlans);
        return {
            plans: enrichedPlans,
            totals: {
                totalProtein: Number(totals.totalProtein.toFixed(2)),
                totalFats: Number(totals.totalFats.toFixed(2)),
                totalCarbs: Number(totals.totalCarbs.toFixed(2)),
                totalCalories: Number(totals.totalCalories.toFixed(2)),
            },
        };
    }
    /**
     * Get single nutrition plan by ID
     */
    async getNutritionPlanById(id) {
        const plan = await athlete_nutrition_model_1.AthleteNutritionPlanModel.findById(id);
        return plan;
    }
    /**
     * Update a nutrition plan by ID
     */
    async updateNutritionPlan(id, payload) {
        const updatedPlan = await athlete_nutrition_model_1.AthleteNutritionPlanModel.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });
        return updatedPlan;
    }
    /**
     * Delete a nutrition plan by ID
     */
    async deleteNutritionPlan(id) {
        const deletedPlan = await athlete_nutrition_model_1.AthleteNutritionPlanModel.findByIdAndDelete(id);
        return deletedPlan;
    }
}
exports.AthleteNutritionPlanService = AthleteNutritionPlanService;
