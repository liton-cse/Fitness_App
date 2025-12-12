import { ISupplementItem } from './supplement.interface';
import { SupplementItemModel } from './supplement.model';

export class SupplementItemService {
  /**
   * Create a new supplement
   */
  async createSupplement(payload: ISupplementItem) {
    const supplement = await SupplementItemModel.create(payload);
    return supplement;
  }

  /**
   * Get all supplements with pagination and optional search by name
   */
  async getAllSupplements(search?: string, page = 1, limit = 10) {
    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const total = await SupplementItemModel.countDocuments(query);
    const items = await SupplementItemModel.find(query).skip(skip).limit(limit);

    return { total, page, limit, items };
  }

  /**
   * Get a supplement by ID
   */
  async getSupplementById(id: string) {
    return await SupplementItemModel.findById(id);
  }

  /**
   * Update a supplement by ID
   */
  async updateSupplement(id: string, payload: Partial<ISupplementItem>) {
    return await SupplementItemModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete a supplement by ID
   */
  async deleteSupplement(id: string) {
    const result = await SupplementItemModel.findByIdAndDelete(id);
    return result;
  }
}
