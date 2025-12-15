"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplementItemService = void 0;
const supplement_model_1 = require("./supplement.model");
class SupplementItemService {
    /**
     * Create a new supplement
     */
    async createSupplement(payload) {
        const supplement = await supplement_model_1.SupplementItemModel.create(payload);
        return supplement;
    }
    /**
     * Get all supplements with pagination and optional search by name
     */
    async getAllSupplements(search, page = 1, limit = 10) {
        const query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        const skip = (page - 1) * limit;
        const total = await supplement_model_1.SupplementItemModel.countDocuments(query);
        const items = await supplement_model_1.SupplementItemModel.find(query).skip(skip).limit(limit);
        return { total, page, limit, items };
    }
    /**
     * Get a supplement by ID
     */
    async getSupplementById(id) {
        return await supplement_model_1.SupplementItemModel.findById(id);
    }
    /**
     * Update a supplement by ID
     */
    async updateSupplement(id, payload) {
        return await supplement_model_1.SupplementItemModel.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });
    }
    /**
     * Delete a supplement by ID
     */
    async deleteSupplement(id) {
        const result = await supplement_model_1.SupplementItemModel.findByIdAndDelete(id);
        return result;
    }
}
exports.SupplementItemService = SupplementItemService;
