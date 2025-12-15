"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoachController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const getFilePath_1 = require("../../../../shared/getFilePath");
const coachService_1 = require("./coachService");
const coachService = new coachService_1.CoachService();
class CoachController {
    constructor() {
        /**
         * Create a new coach
         * POST /api/v1/coaches
         */
        this.create = (0, catchAsync_1.default)(async (req, res, next) => {
            // Get image file path if uploaded
            let image = (0, getFilePath_1.getSingleFilePath)(req.files, 'image');
            // Prepare data for creation
            const data = {
                ...req.body,
                image,
            };
            // Create coach using service
            const result = await coachService.createCoach(data);
            // Send success response
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: 'Coach created successfully',
                data: result,
            });
        });
        /**
         * Get all coaches with pagination
         * GET /api/v1/coaches
         */
        this.getAll = (0, catchAsync_1.default)(async (req, res, next) => {
            // Extract query parameters
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const { isActive, search, verified, ...otherFilters } = req.query;
            // Build filter object
            const filter = { ...otherFilters };
            if (isActive)
                filter.isActive = isActive;
            if (verified !== undefined)
                filter.verified = verified === 'true';
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ];
            }
            // Get coaches using service
            const result = await coachService.getAllCoaches(page, limit, filter);
            // Send success response
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Coaches retrieved successfully',
                data: result.coaches,
            });
        });
        /**
         * Get single coach by ID
         * GET /api/v1/coaches/:id
         */
        this.getById = (0, catchAsync_1.default)(async (req, res, next) => {
            const { id } = req.params;
            // Get coach by ID using service
            const result = await coachService.getCoachById(id);
            // Check if coach exists
            if (!result) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: 'Coach not found',
                    data: null,
                });
            }
            // Send success response
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Coach retrieved successfully',
                data: result,
            });
        });
        /**
         * Update coach by ID
         * PATCH /api/v1/coaches/:id
         */
        this.update = (0, catchAsync_1.default)(async (req, res, next) => {
            const { id } = req.params;
            // Get image file path if uploaded
            let image = (0, getFilePath_1.getSingleFilePath)(req.files, 'image');
            // Prepare update data
            const updateData = {
                ...req.body,
                ...(image && { image }),
            };
            // Update coach using service
            const result = await coachService.updateCoach(id, updateData);
            // Check if coach exists
            if (!result) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: 'Coach not found',
                    data: null,
                });
            }
            // Send success response
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Coach updated successfully',
                data: result,
            });
        });
        /**
         * Delete coach (soft delete)
         * DELETE /api/v1/coaches/:id
         */
        this.delete = (0, catchAsync_1.default)(async (req, res, next) => {
            const { id } = req.params;
            // Delete coach using service
            const result = await coachService.deleteCoach(id);
            // Check if coach exists
            if (!result) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: 'Coach not found',
                    data: null,
                });
            }
            // Send success response
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Coach deleted successfully',
                data: result,
            });
        });
        /**
         * Verify coach account
         * PATCH /api/v1/coaches/:id/verify
         */
        this.verifyCoach = (0, catchAsync_1.default)(async (req, res, next) => {
            const { id } = req.params;
            const { verified } = req.body;
            // Update verification status using service
            const result = await coachService.updateVerificationStatus(id, verified);
            // Check if coach exists
            if (!result) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: 'Coach not found',
                    data: null,
                });
            }
            const message = verified
                ? 'Coach verified successfully'
                : 'Coach unverified successfully';
            // Send success response
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message,
                data: result,
            });
        });
        /**
         * Update coach last active timestamp
         * PATCH /api/v1/coaches/:id/last-active
         */
        this.updateLastActive = (0, catchAsync_1.default)(async (req, res, next) => {
            const { id } = req.params;
            // Update last active timestamp using service
            const result = await coachService.updateLastActive(id);
            // Check if coach exists
            if (!result) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: 'Coach not found',
                    data: null,
                });
            }
            // Send success response
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Last active timestamp updated successfully',
                data: result,
            });
        });
        /**
         * Change coach password
         * PATCH /api/v1/coaches/:id/change-password
         */
        this.changePassword = (0, catchAsync_1.default)(async (req, res, next) => {
            const { id } = req.params;
            const { currentPassword, newPassword } = req.body;
            // Change password using service
            const result = await coachService.changePassword(id, currentPassword, newPassword);
            // Send success response
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Password changed successfully',
                data: result,
            });
        });
        /**
         * Request password reset
         * POST /api/v1/coaches/request-password-reset
         */
        this.requestPasswordReset = (0, catchAsync_1.default)(async (req, res, next) => {
            const { email } = req.body;
            // Generate one-time code (6 digits)
            const oneTimeCode = Math.floor(100000 + Math.random() * 900000);
            const expireAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
            // Set reset password data
            const result = await coachService.setResetPasswordData(email, oneTimeCode, expireAt);
            if (!result) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: 'Coach not found',
                    data: null,
                });
            }
            // TODO: Send email with oneTimeCode
            // This is where you would integrate your email service
            // Send success response
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Password reset code sent to email',
                data: {
                    // In production, don't send the code in response
                    // This is for testing purposes only
                    oneTimeCode: process.env.NODE_ENV === 'development' ? oneTimeCode : undefined,
                    expiresIn: '15 minutes',
                },
            });
        });
        /**
         * Reset password using code
         * POST /api/v1/coaches/reset-password
         */
        this.resetPassword = (0, catchAsync_1.default)(async (req, res, next) => {
            const { email, oneTimeCode, newPassword } = req.body;
            // Reset password using service
            const result = await coachService.resetPassword(email, oneTimeCode, newPassword);
            // Send success response
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Password reset successfully',
                data: result,
            });
        });
    }
}
exports.CoachController = CoachController;
