"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalNutritionFromPlans = exports.calculateMacrosByQuantity = void 0;
const calculateMacrosByQuantity = (macros, consumedQuantity) => {
    const ratio = macros.defaultQuantity === 1
        ? consumedQuantity
        : consumedQuantity / macros.defaultQuantity;
    return {
        calories: Number((macros.caloriesQuantity * ratio).toFixed(2)),
        protein: Number((macros.proteinQuantity * ratio).toFixed(2)),
        fats: Number((macros.fatsQuantity * ratio).toFixed(2)),
        carbs: Number((macros.carbsQuantity * ratio).toFixed(2)),
    };
};
exports.calculateMacrosByQuantity = calculateMacrosByQuantity;
/**
 * Calculate total macros from enriched nutrition plans array
 */
const calculateTotalNutritionFromPlans = (plans) => {
    return plans.reduce((acc, plan) => {
        acc.totalProtein += plan.totalProtein || 0;
        acc.totalFats += plan.totalFats || 0;
        acc.totalCarbs += plan.totalCarbs || 0;
        acc.totalCalories += plan.totalCalories || 0;
        return acc;
    }, {
        totalProtein: 0,
        totalFats: 0,
        totalCarbs: 0,
        totalCalories: 0,
    });
};
exports.calculateTotalNutritionFromPlans = calculateTotalNutritionFromPlans;
