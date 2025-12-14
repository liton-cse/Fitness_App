import CheckInModel from './checkin.model';
import { Types } from 'mongoose';
import { ICheckInInfo } from './checkin.interface';

export class CheckInService {
  /**
   * Create a new Check-in record
   * @param payload - Check-in data
   * @returns created CheckIn document
   */
  async createCheckIn(payload: Partial<ICheckInInfo>): Promise<ICheckInInfo> {
    const result = await CheckInModel.create(payload);
    return result;
  }

  /**
   * Get all Check-in records for a user
   * @param userId - User ID
   * @returns array of CheckIn documents
   */
  async getCheckInsByUser(userId: Types.ObjectId): Promise<ICheckInInfo[]> {
    const result = await CheckInModel.find({ userId }).sort({ createdAt: -1 });
    return result;
  }

  /**
   * Get a single Check-in by ID
   * @param id - Check-in ID
   * @returns CheckIn document or null
   */
  async getCheckInById(id: Types.ObjectId): Promise<ICheckInInfo | null> {
    const result = await CheckInModel.findById(id);
    return result;
  }

  /**
   * Update a Check-in record by ID
   * @param id - Check-in ID
   * @param payload - Fields to update
   * @returns updated CheckIn document or null
   */
  async updateCheckIn(
    id: Types.ObjectId,
    payload: Partial<ICheckInInfo>
  ): Promise<ICheckInInfo | null> {
    const result = await CheckInModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return result;
  }

  /**
   * Delete a Check-in record by ID
   * @param id - Check-in ID
   * @returns deleted CheckIn document or null
   */
  async deleteCheckIn(id: Types.ObjectId): Promise<ICheckInInfo | null> {
    const result = await CheckInModel.findByIdAndDelete(id);
    return result;
  }
}
