"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyTrackingController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const daily_tracking_service_1 = require("./daily.tracking.service");
const dailyTrackingService = new daily_tracking_service_1.DailyTrackingService();
class DailyTrackingController {
    constructor() {
        /**
         * Create daily tracking
         * POST /api/v1/daily-tracking
         */
        this.createDailyTracking = (0, catchAsync_1.default)(async (req, res, next) => {
            const payload = {
                ...req.body,
                userId: req.user.id,
            };
            const result = await dailyTrackingService.createDailyTracking(payload);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: 'Daily tracking created successfully',
                data: result,
            });
        });
        /**
         * Get all daily tracking records
         * GET /api/v1/daily-tracking
         */
        this.getAllDailyTracking = (0, catchAsync_1.default)(async (req, res, next) => {
            const userId = req.user.id;
            const result = await dailyTrackingService.getAllDailyTracking(userId);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Daily tracking fetched successfully',
                data: result,
            });
        });
        /**
         * Get single daily tracking by ID
         * GET /api/v1/daily-tracking/:id
         */
        this.getSingleDailyTracking = (0, catchAsync_1.default)(async (req, res, next) => {
            const { id } = req.params;
            const result = await dailyTrackingService.getDailyTrackingById(id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Daily tracking fetched successfully',
                data: result,
            });
        });
        /**
         * Update daily tracking by ID
         * PATCH /api/v1/daily-tracking/:id
         */
        this.updateDailyTracking = (0, catchAsync_1.default)(async (req, res, next) => {
            const { id } = req.params;
            const result = await dailyTrackingService.updateDailyTracking(id, req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Daily tracking updated successfully',
                data: result,
            });
        });
        /**
         * Delete daily tracking by ID
         * DELETE /api/v1/daily-tracking/:id
         */
        this.deleteDailyTracking = (0, catchAsync_1.default)(async (req, res, next) => {
            const { id } = req.params;
            const result = await dailyTrackingService.deleteDailyTracking(id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Daily tracking deleted successfully',
                data: result,
            });
        });
    }
}
exports.DailyTrackingController = DailyTrackingController;
