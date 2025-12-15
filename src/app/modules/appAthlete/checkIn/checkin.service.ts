import CheckInModel from './checkin.model';
import { Types } from 'mongoose';
import { ICheckInInfo } from './checkin.interface';
import { meta } from 'zod/v4/core';
import { AthleteModel } from '../../adminPanel/athlete/athleteModel';
import {
  getNextCheckInDateFormatted,
  humanReadableFormate,
} from '../../../../util/calculate.date';
import { DailyTrackingModel } from '../dailyTracking/daily.tracking.model';

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
  async getCheckInsByUser(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      CheckInModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CheckInModel.countDocuments({ userId }),
    ]);

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data,
    };
  }

  /**
   * Gets athlete check-in day and calculates next check-in date
   */
  async getNextCheckInInfo(userId: string) {
    const athlete = await AthleteModel.findById(userId);
    if (!athlete) {
      throw new Error('Athlete not found');
    }
    const checkInDay = athlete.checkInDay;
    const lastCheckIn = await DailyTrackingModel.findOne({ userId }).sort({
      createdAt: -1,
    });

    if (!lastCheckIn) {
      return {
        checkInDay,
        nextCheckInDate: getNextCheckInDateFormatted(checkInDay),
        averageWeight: null,
        message: 'No previous check-in data found',
      };
    }

    const lastCheckInDate = lastCheckIn.createdAt;
    const today = new Date();

    const trackingData = await DailyTrackingModel.find({
      userId,
      createdAt: {
        $gte: lastCheckInDate,
        $lte: today,
      },
    })
      .sort({ createdAt: -1 })
      .lean();

    const currentWeight =
      trackingData?.length > 0 ? trackingData[0].weight : null;

    const totalWeight = trackingData.reduce(
      (sum, item) => sum + item.weight,
      0
    );

    const averageWeight =
      trackingData.length > 0
        ? Number((totalWeight / trackingData.length).toFixed(2))
        : null;

    const nextCheckInDate = getNextCheckInDateFormatted(checkInDay);
    const lastDate = humanReadableFormate(lastCheckInDate);
    return {
      checkInDay,
      lastDate,
      nextCheckInDate,
      currentWeight,
      averageWeight,
    };
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
