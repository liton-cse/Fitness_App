"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodItemModel = void 0;
const mongoose_1 = require("mongoose");
const food_interface_1 = require("./food.interface");
const FoodItemSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: {
        type: String,
        enum: Object.values(food_interface_1.FoodCategory),
        required: true,
    },
    defaultQuantity: { type: String, required: true },
    caloriesQuantity: { type: Number, required: true },
    proteinQuantity: { type: Number, required: true },
    fatsQuantity: { type: Number, required: true },
    carbsQuantity: { type: Number, required: true },
    sugarQuantity: { type: Number, required: true },
    fiberQuantity: { type: Number, required: true },
    saturatedFats: { type: Number, required: true },
    unsaturatedFats: { type: Number, required: true },
}, { timestamps: true });
exports.FoodItemModel = (0, mongoose_1.model)('FoodItem', FoodItemSchema);
