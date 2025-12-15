"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodItemService = void 0;
const food_model_1 = require("./food.model");
class FoodItemService {
    /**
     * Create a new food item
     */
    async createFoodItem(payload) {
        const foodItem = await food_model_1.FoodItemModel.create(payload);
        return foodItem;
    }
    /**
     * Get all food items with pagination and search by name
     */
    async getAllFoodItems(search, page = 1, limit = 10, filter) {
        const query = {};
        if (search) {
            query.category = { $regex: search, $options: 'i' };
        }
        if (filter) {
            query.name = { $regex: filter, $options: 'i' };
        }
        const skip = (page - 1) * limit;
        const total = await food_model_1.FoodItemModel.countDocuments(query);
        const items = await food_model_1.FoodItemModel.find(query).skip(skip).limit(limit);
        return {
            total,
            page,
            limit,
            items,
        };
    }
    /**
     * Get food item by ID
     */
    async getFoodItemById(id) {
        const foodItem = await food_model_1.FoodItemModel.findById(id);
        return foodItem;
    }
    /**
     * Update a food item by ID
     */
    async updateFoodItem(id, payload) {
        const updated = await food_model_1.FoodItemModel.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });
        return updated;
    }
    /**
     * Delete a food item by ID
     */
    async deleteFoodItem(id) {
        await food_model_1.FoodItemModel.findByIdAndDelete(id);
    }
}
exports.FoodItemService = FoodItemService;
