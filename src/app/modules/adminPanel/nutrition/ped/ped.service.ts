import { PEDInfoModel } from './ped.model';
import { IDosageInfo, IPEDInfo } from './ped.interface';

export class PEDInfoService {
  /**
   * Create new PED info
   * Automatically sets week based on current date
   */
  async createPEDInfo(payload: IPEDInfo) {
    // Determine current date to set week
    const day = new Date().getDate(); // 1-31
    let week = 'week1';
    if (day >= 1 && day <= 7) week = 'week1';
    else if (day >= 8 && day <= 15) week = 'week2';
    else if (day >= 16 && day <= 23) week = 'week3';
    else if (day >= 24 && day <= 31) week = 'week4';

    const dataToSave = {
      ...payload,
      week,
    };

    const result = await PEDInfoModel.create(dataToSave);
    return result;
  }

  /**
   * Get all PED info (with search + pagination)
   */
  async getAllPEDInfo(
    search: string = '',
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { category: new RegExp(search, 'i') },
        { subCategory: new RegExp(search, 'i') },
        { week: new RegExp(search, 'i') },
      ];
    }

    const data = await PEDInfoModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await PEDInfoModel.countDocuments(filter);

    return { meta: { page, limit, total }, data };
  }

  /**
   * Get single PED info by ID
   */
  async getPEDInfoById(id: string) {
    return await PEDInfoModel.findById(id);
  }

  /**
   * Update PED info by ID
   */
  async updatePEDInfo(payload: Partial<IPEDInfo>) {
    const { category, subCategory, ped, week } = payload;

    if (!category || !subCategory) {
      throw new Error(
        'Category and subCategory are required to update PED info'
      );
    }

    // Build dynamic $set object
    const updateData: any = {};
    if (week !== undefined) updateData.week = week;

    if (ped) {
      // Handle nested ped object
      for (const key in ped) {
        if (ped[key as keyof IDosageInfo] !== undefined) {
          updateData[`ped.${key}`] = ped[key as keyof IDosageInfo];
        }
      }
    }

    const updatedPED = await PEDInfoModel.findOneAndUpdate(
      { category, subCategory },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return updatedPED;
  }

  /**
   * Delete PED info by ID
   */
  async deletePEDInfo(id: string) {
    return await PEDInfoModel.findByIdAndDelete(id);
  }
}
