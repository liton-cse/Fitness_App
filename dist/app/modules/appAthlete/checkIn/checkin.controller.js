"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const checkin_service_1 = require("./checkin.service");
const mongoose_1 = require("mongoose");
const getFilePath_1 = require("../../../../shared/getFilePath");
const checkInService = new checkin_service_1.CheckInService();
class CheckInController {
    constructor() {
        /**
         * Create a new Check-in
         * POST /api/v1/checkin
         */
        this.createCheckIn = (0, catchAsync_1.default)(async (req, res, next) => {
            const images = (0, getFilePath_1.getMultipleFilesPath)(req.files, 'image');
            const videos = (0, getFilePath_1.getMultipleFilesPath)(req.files, 'video');
            const payload = {
                ...req.body,
                userId: req.user.id,
                image: images,
                video: videos,
            };
            const result = await checkInService.createCheckIn(payload);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: 'Check-in created successfully',
                data: result,
            });
        });
        /**
         * Get all Check-ins for logged-in user
         * GET /api/v1/checkin
         */
        this.getAllCheckIns = (0, catchAsync_1.default)(async (req, res, next) => {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 1;
            const result = await checkInService.getCheckInsByUser(req.user.id, page, limit);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Fetched all check-ins successfully',
                data: result,
            });
        });
        /**
         * Returns next check-in date based on athlete's check-in day
         */
        this.getNextCheckInDate = (0, catchAsync_1.default)(async (req, res) => {
            const userId = req.user.id;
            const result = await checkInService.getNextCheckInInfo(userId);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Next check-in date calculated successfully',
                data: result,
            });
        });
        /**
         * Get a single Check-in by ID
         * GET /api/v1/checkin/:id
         */
        this.getCheckInById = (0, catchAsync_1.default)(async (req, res, next) => {
            // Convert string ID to ObjectId
            const id = new mongoose_1.Types.ObjectId(req.params.id);
            const result = await checkInService.getCheckInById(id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Fetched check-in successfully',
                data: result,
            });
        });
        /**
         * Update a Check-in by ID
         * PATCH /api/v1/checkin/:id
         */
        this.updateCheckIn = (0, catchAsync_1.default)(async (req, res, next) => {
            const id = new mongoose_1.Types.ObjectId(req.params.id);
            const result = await checkInService.updateCheckIn(id, req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Check-in updated successfully',
                data: result,
            });
        });
        /**
         * Delete a Check-in by ID
         * DELETE /api/v1/checkin/:id
         */
        this.deleteCheckIn = (0, catchAsync_1.default)(async (req, res, next) => {
            const id = new mongoose_1.Types.ObjectId(req.params.id);
            const result = await checkInService.deleteCheckIn(id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Check-in deleted successfully',
                data: result,
            });
        });
    }
}
exports.CheckInController = CheckInController;
