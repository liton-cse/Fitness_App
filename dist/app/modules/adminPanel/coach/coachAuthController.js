"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoachAuthController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const coachAuthService_1 = require("./coachAuthService");
const authService = new coachAuthService_1.CoachAuthService();
class CoachAuthController {
    constructor() {
        /**
         * Login coach
         * POST /api/v1/auth/login
         */
        this.login = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await authService.loginCoachFromDB(req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Coach logged in successfully',
                data: result,
            });
        });
        /**
         * Request password reset OTP
         * POST /api/v1/auth/forgot-password
         */
        this.forgotPassword = (0, catchAsync_1.default)(async (req, res, next) => {
            const { email } = req.body;
            const result = await authService.forgetPasswordToDB(email);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: result.message,
                data: {
                    otp: result.otp, // Only in development
                },
            });
        });
        /**
         * Verify email with OTP
         * POST /api/v1/auth/verify-email
         */
        this.verifyEmail = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await authService.verifyEmailToDB(req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: result.message,
                data: result.data ? { token: result.data } : null,
            });
        });
        /**
         * Reset password with token
         * POST /api/v1/auth/reset-password/:token
         */
        this.resetPassword = (0, catchAsync_1.default)(async (req, res, next) => {
            const { token } = req.params;
            const result = await authService.resetPasswordToDB(token, req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: result.message,
                data: null,
            });
        });
        /**
         * Change password (authenticated)
         * PATCH /api/v1/auth/change-password
         */
        this.changePassword = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await authService.changePasswordToDB(req.user, req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: result.message,
                data: null,
            });
        });
        /**
         * Get coach profile
         * GET /api/v1/auth/profile
         */
        this.getProfile = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await authService.getProfile(req.user);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Profile retrieved successfully',
                data: result,
            });
        });
        /**
         * Update coach profile
         * PATCH /api/v1/auth/profile
         */
        this.updateProfile = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await authService.updateProfile(req.user, req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Profile updated successfully',
                data: result,
            });
        });
        /**
         * Logout coach
         * POST /api/v1/auth/logout
         */
        this.logout = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await authService.logoutCoach(req.user);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: result.message,
                data: null,
            });
        });
        /**
         * Request email verification OTP
         * POST /api/v1/auth/request-verification
         */
        this.requestVerification = (0, catchAsync_1.default)(async (req, res, next) => {
            const { email } = req.body;
            const result = await authService.requestEmailVerification(email);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: result.message,
                data: {
                    otp: result.otp, // Only in development
                },
            });
        });
    }
}
exports.CoachAuthController = CoachAuthController;
