import { IShowManagement } from './management.interface';
import { ShowManagementModel } from './management.model';

export class ShowManagementService {
  /**
   * Create a new show management entry
   * @param payload - ShowManagement data
   * @returns Created document
   */
  async createShow(payload: IShowManagement) {
    const result = await ShowManagementModel.create(payload);
    return result;
  }

  /**
   * Get all shows, sorted by newest first
   * @returns Array of ShowManagement
   */
  async getAllShows() {
    const shows = await ShowManagementModel.find().sort({ createdAt: -1 });
    return shows;
  }

  /**
   * Get a single show by ID
   * @param id - ShowManagement ID
   * @returns ShowManagement document
   */
  async getShowById(id: string) {
    const show = await ShowManagementModel.findById(id);
    return show;
  }

  /**
   * Update a show by ID
   * @param id - ShowManagement ID
   * @param payload - Partial data to update
   * @returns Updated document
   */
  async updateShow(id: string, payload: Partial<IShowManagement>) {
    const updatedShow = await ShowManagementModel.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, runValidators: true }
    );
    return updatedShow;
  }

  /**
   * Delete a show by ID
   * @param id - ShowManagement ID
   * @returns Deleted document
   */
  async deleteShow(id: string) {
    const deletedShow = await ShowManagementModel.findByIdAndDelete(id);
    return deletedShow;
  }
}
