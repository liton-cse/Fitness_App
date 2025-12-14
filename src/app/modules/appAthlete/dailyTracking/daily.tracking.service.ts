import { DailyTrackingModel } from './daily.tracking.model';
import { DailyTracking } from './daily.tracking.interface';
import { calculateNumericAverages } from '../../../../util/calculate.average';

export class DailyTrackingService {
  /**
   * Create a daily tracking entry
   */
  async createDailyTracking(payload: DailyTracking): Promise<DailyTracking> {
    const result = await DailyTrackingModel.create(payload);
    return result;
  }

  /**
   * Get all daily tracking entries
   */
  async getAllDailyTracking(userId: string): Promise<{
    weekData: (Omit<DailyTracking, keyof Document> & { day: string })[];
    averages: ReturnType<typeof calculateNumericAverages>;
  }> {
    const latestEntry = await DailyTrackingModel.findOne({ userId })
      .sort({ date: 1 })
      .select('date')
      .lean();

    if (!latestEntry?.date) {
      return { weekData: [], averages: {} as any };
    }

    const [year, month, day] = latestEntry.date.split('-').map(Number);
    const latestDate = new Date(year, month - 1, day);

    const monday = new Date(latestDate);
    monday.setDate(latestDate.getDate() - ((latestDate.getDay() + 6) % 7));

    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      weekDates.push(`${yyyy}-${mm}-${dd}`);
    }

    const data = await DailyTrackingModel.find({
      userId,
      date: { $in: weekDates },
    })
      .sort({ date: 1 })
      .lean();

    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const weekData = data.map(item => {
      const [y, m, d] = item.date.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return {
        ...item,
        day: dayNames[dateObj.getDay()],
      };
    });

    const averages = calculateNumericAverages(data);

    return { weekData, averages };
  }

  /**
   * Get single daily tracking by ID
   */
  async getDailyTrackingById(id: string): Promise<DailyTracking | null> {
    return DailyTrackingModel.findById(id);
  }

  /**
   * Update daily tracking by ID
   */
  async updateDailyTracking(
    id: string,
    payload: Partial<DailyTracking>
  ): Promise<DailyTracking | null> {
    return DailyTrackingModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete daily tracking by ID
   */
  async deleteDailyTracking(id: string): Promise<DailyTracking | null> {
    return DailyTrackingModel.findByIdAndDelete(id);
  }
}
