"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInService = void 0;
const checkin_model_1 = __importDefault(require("./checkin.model"));
const athleteModel_1 = require("../../adminPanel/athlete/athleteModel");
const calculate_date_1 = require("../../../../util/calculate.date");
const daily_tracking_model_1 = require("../dailyTracking/daily.tracking.model");
class CheckInService {
    /**
     * Create a new Check-in record
     * @param payload - Check-in data
     * @returns created CheckIn document
     */
    async createCheckIn(payload) {
        const result = await checkin_model_1.default.create(payload);
        return result;
    }
    /**
     * Get all Check-in records for a user
     * @param userId - User ID
     * @returns array of CheckIn documents
     */
    async getCheckInsByUser(userId, page, limit) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            checkin_model_1.default.find({ userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            checkin_model_1.default.countDocuments({ userId }),
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
    async getNextCheckInInfo(userId) {
        const athlete = await athleteModel_1.AthleteModel.findById(userId);
        if (!athlete) {
            throw new Error('Athlete not found');
        }
        const checkInDay = athlete.checkInDay;
        const lastCheckIn = await daily_tracking_model_1.DailyTrackingModel.findOne({ userId }).sort({
            createdAt: -1,
        });
        if (!lastCheckIn) {
            return {
                checkInDay,
                nextCheckInDate: (0, calculate_date_1.getNextCheckInDateFormatted)(checkInDay),
                averageWeight: null,
                message: 'No previous check-in data found',
            };
        }
        const lastCheckInDate = lastCheckIn.createdAt;
        const today = new Date();
        const trackingData = await daily_tracking_model_1.DailyTrackingModel.find({
            userId,
            createdAt: {
                $gte: lastCheckInDate,
                $lte: today,
            },
        })
            .sort({ createdAt: -1 })
            .lean();
        const currentWeight = trackingData?.length > 0 ? trackingData[0].weight : null;
        const totalWeight = trackingData.reduce((sum, item) => sum + item.weight, 0);
        const averageWeight = trackingData.length > 0
            ? Number((totalWeight / trackingData.length).toFixed(2))
            : null;
        const nextCheckInDate = (0, calculate_date_1.getNextCheckInDateFormatted)(checkInDay);
        const lastDate = (0, calculate_date_1.humanReadableFormate)(lastCheckInDate);
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
    async getCheckInById(id) {
        const result = await checkin_model_1.default.findById(id);
        return result;
    }
    /**
     * Update a Check-in record by ID
     * @param id - Check-in ID
     * @param payload - Fields to update
     * @returns updated CheckIn document or null
     */
    async updateCheckIn(id, payload) {
        const result = await checkin_model_1.default.findByIdAndUpdate(id, payload, {
            new: true,
        });
        return result;
    }
    /**
     * Delete a Check-in record by ID
     * @param id - Check-in ID
     * @returns deleted CheckIn document or null
     */
    async deleteCheckIn(id) {
        const result = await checkin_model_1.default.findByIdAndDelete(id);
        return result;
    }
}
exports.CheckInService = CheckInService;
