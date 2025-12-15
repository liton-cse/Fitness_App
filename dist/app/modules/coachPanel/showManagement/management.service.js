"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowManagementService = void 0;
const management_model_1 = require("./management.model");
class ShowManagementService {
    /**
     * Create a new show management entry
     * @param payload - ShowManagement data
     * @returns Created document
     */
    async createShow(payload) {
        const result = await management_model_1.ShowManagementModel.create(payload);
        return result;
    }
    /**
     * Get all shows, sorted by newest first
     * @returns Array of ShowManagement
     */
    async getAllShows() {
        const shows = await management_model_1.ShowManagementModel.find().sort({ createdAt: -1 });
        return shows;
    }
    /**
     * Get a single show by ID
     * @param id - ShowManagement ID
     * @returns ShowManagement document
     */
    async getShowById(id) {
        const show = await management_model_1.ShowManagementModel.findById(id);
        return show;
    }
    /**
     * Update a show by ID
     * @param id - ShowManagement ID
     * @param payload - Partial data to update
     * @returns Updated document
     */
    async updateShow(id, payload) {
        const updatedShow = await management_model_1.ShowManagementModel.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
        return updatedShow;
    }
    /**
     * Delete a show by ID
     * @param id - ShowManagement ID
     * @returns Deleted document
     */
    async deleteShow(id) {
        const deletedShow = await management_model_1.ShowManagementModel.findByIdAndDelete(id);
        return deletedShow;
    }
}
exports.ShowManagementService = ShowManagementService;
