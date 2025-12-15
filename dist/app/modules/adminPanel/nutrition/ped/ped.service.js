"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PEDInfoService = void 0;
const ped_model_1 = require("./ped.model");
class PEDInfoService {
    /**
     * Create new PED info
     * Automatically sets week based on current date
     */
    async createPEDInfo(payload) {
        // Determine current date to set week
        const day = new Date().getDate(); // 1-31
        let week = 'week1';
        if (day >= 1 && day <= 7)
            week = 'week1';
        else if (day >= 8 && day <= 15)
            week = 'week2';
        else if (day >= 16 && day <= 23)
            week = 'week3';
        else if (day >= 24 && day <= 31)
            week = 'week4';
        const dataToSave = {
            ...payload,
            week,
        };
        const result = await ped_model_1.PEDInfoModel.create(dataToSave);
        return result;
    }
    /**
     * Get all PED info (with search + pagination)
     */
    async getAllPEDInfo(search = '', page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const filter = {};
        if (search) {
            filter.$or = [
                { category: new RegExp(search, 'i') },
                { subCategory: new RegExp(search, 'i') },
                { week: new RegExp(search, 'i') },
            ];
        }
        const data = await ped_model_1.PEDInfoModel.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await ped_model_1.PEDInfoModel.countDocuments(filter);
        return { meta: { page, limit, total }, data };
    }
    /**
     * Get single PED info by ID
     */
    async getPEDInfoById(id) {
        return await ped_model_1.PEDInfoModel.findById(id);
    }
    /**
     * Update PED info by ID
     */
    async updatePEDInfo(payload) {
        const { category, subCategory, ped, week } = payload;
        if (!category || !subCategory) {
            throw new Error('Category and subCategory are required to update PED info');
        }
        // Build dynamic $set object
        const updateData = {};
        if (week !== undefined)
            updateData.week = week;
        if (ped) {
            // Handle nested ped object
            for (const key in ped) {
                if (ped[key] !== undefined) {
                    updateData[`ped.${key}`] = ped[key];
                }
            }
        }
        const updatedPED = await ped_model_1.PEDInfoModel.findOneAndUpdate({ category, subCategory }, { $set: updateData }, { new: true, runValidators: true });
        return updatedPED;
    }
    /**
     * Delete PED info by ID
     */
    async deletePEDInfo(id) {
        return await ped_model_1.PEDInfoModel.findByIdAndDelete(id);
    }
}
exports.PEDInfoService = PEDInfoService;
