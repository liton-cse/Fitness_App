"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyTrackingService = void 0;
const daily_tracking_model_1 = require("./daily.tracking.model");
const calculate_average_1 = require("../../../../util/calculate.average");
class DailyTrackingService {
    /**
     * Create a daily tracking entry
     */
    async createDailyTracking(payload) {
        const result = await daily_tracking_model_1.DailyTrackingModel.create(payload);
        return result;
    }
    /**
     * Get all daily tracking entries
     */
    async getAllDailyTracking(userId) {
        const latestEntry = await daily_tracking_model_1.DailyTrackingModel.findOne({ userId })
            .sort({ date: 1 })
            .select('date')
            .lean();
        if (!latestEntry?.date) {
            return { weekData: [], averages: {} };
        }
        const [year, month, day] = latestEntry.date.split('-').map(Number);
        const latestDate = new Date(year, month - 1, day);
        const monday = new Date(latestDate);
        monday.setDate(latestDate.getDate() - ((latestDate.getDay() + 6) % 7));
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            weekDates.push(`${yyyy}-${mm}-${dd}`);
        }
        const data = await daily_tracking_model_1.DailyTrackingModel.find({
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
        const averages = (0, calculate_average_1.calculateNumericAverages)(data);
        return { weekData, averages };
    }
    /**
     * Get single daily tracking by ID
     */
    async getDailyTrackingById(id) {
        return daily_tracking_model_1.DailyTrackingModel.findById(id);
    }
    /**
     * Update daily tracking by ID
     */
    async updateDailyTracking(id, payload) {
        return daily_tracking_model_1.DailyTrackingModel.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });
    }
    /**
     * Delete daily tracking by ID
     */
    async deleteDailyTracking(id) {
        return daily_tracking_model_1.DailyTrackingModel.findByIdAndDelete(id);
    }
}
exports.DailyTrackingService = DailyTrackingService;
