"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoachService = void 0;
const mongoose_1 = require("mongoose");
const user_1 = require("../../../../enums/user");
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const coachModel_1 = require("./coachModel");
const generateOTP_1 = __importDefault(require("../../../../util/generateOTP"));
const emailTemplate_1 = require("../../../../shared/emailTemplate");
const emailHelper_1 = require("../../../../helpers/emailHelper");
class CoachService {
    constructor() {
        this.model = coachModel_1.CoachModel;
    }
    /**
     * Create a new coach
     * @param data Coach data
     * @returns Created coach
     */
    async createCoach(data) {
        try {
            // Check if email already exists
            const existingCoach = await this.model.isExistCoachByEmail(data.email);
            if (existingCoach) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email already exists');
            }
            // Create coach with default role
            const coachData = {
                ...data,
                role: user_1.USER_ROLES.COACH,
            };
            const coach = await this.model.create(coachData);
            if (!coach) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create Athlete');
            }
            //send email
            const otp = (0, generateOTP_1.default)();
            const values = {
                name: coach.name,
                otp: otp,
                email: coach.email,
            };
            const createAccountTemplate = emailTemplate_1.emailTemplate.createAccount(values);
            emailHelper_1.emailHelper.sendEmail(createAccountTemplate);
            //save to DB
            const authentication = {
                oneTimeCode: otp,
                expireAt: new Date(Date.now() + 3 * 60000),
            };
            await this.model.findOneAndUpdate({ _id: coach._id }, { $set: { authentication } });
            return coach;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Get all coaches with pagination and filtering
     * @param page Page number
     * @param limit Items per page
     * @param filter Filter conditions
     * @returns Coaches with pagination metadata
     */
    async getAllCoaches(page = 1, limit = 10, filter = {}) {
        try {
            const skip = (page - 1) * limit;
            const [coaches, total] = await Promise.all([
                this.model
                    .find(filter)
                    .select('-password -authentication')
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .lean(),
                this.model.countDocuments(filter),
            ]);
            return {
                coaches,
                meta: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Get single coach by ID
     * @param id Coach ID
     * @returns Coach document
     */
    async getCoachById(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid coach ID');
            }
            const coach = await this.model
                .findById(id)
                .select('-password -authentication')
                .lean();
            return coach;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Get coach by email
     * @param email Coach email
     * @returns Coach document
     */
    async getCoachByEmail(email) {
        try {
            const coach = await this.model
                .findOne({ email })
                .select('-password -authentication')
                .lean();
            return coach;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Update coach by ID
     * @param id Coach ID
     * @param updateData Data to update
     * @returns Updated coach
     */
    async updateCoach(id, updateData) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid coach ID');
            }
            // Check if coach exists
            const existingCoach = await this.model.isExistCoachById(id);
            if (!existingCoach) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Coach not found');
            }
            // Remove password and email from update data (these should be updated separately)
            const { password, email, ...safeUpdateData } = updateData;
            const coach = await this.model
                .findByIdAndUpdate(id, { $set: safeUpdateData }, { new: true, runValidators: true })
                .select('-password -authentication')
                .lean();
            return coach;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Delete coach (soft delete by setting isActive to 'In-Active')
     * @param id Coach ID
     * @returns Updated coach
     */
    async deleteCoach(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid coach ID');
            }
            // Check if coach exists
            const existingCoach = await this.model.isExistCoachById(id);
            if (!existingCoach) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Coach not found');
            }
            const coach = await this.model.findByIdAndDelete(id);
            return coach;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Update coach verification status
     * @param id Coach ID
     * @param verified Verification status
     * @returns Updated coach
     */
    async updateVerificationStatus(id, verified) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid coach ID');
            }
            // Check if coach exists
            const existingCoach = await this.model.isExistCoachById(id);
            if (!existingCoach) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Coach not found');
            }
            const coach = await this.model
                .findByIdAndUpdate(id, { $set: { verified } }, { new: true })
                .select('-password -authentication')
                .lean();
            return coach;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Update coach last active timestamp
     * @param id Coach ID
     * @returns Updated coach
     */
    async updateLastActive(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid coach ID');
            }
            // Check if coach exists
            const existingCoach = await this.model.isExistCoachById(id);
            if (!existingCoach) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Coach not found');
            }
            const coach = await this.model
                .findByIdAndUpdate(id, { $set: { lastActive: new Date() } }, { new: true })
                .select('-password -authentication')
                .lean();
            return coach;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Change coach password
     * @param id Coach ID
     * @param currentPassword Current password
     * @param newPassword New password
     * @returns Success status
     */
    async changePassword(id, currentPassword, newPassword) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid coach ID');
            }
            // Get coach with password
            const coach = await this.model.findById(id);
            if (!coach) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Coach not found');
            }
            // Verify current password
            const isMatch = await this.model.isMatchPassword(currentPassword, coach.password);
            if (!isMatch) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Current password is incorrect');
            }
            // Update password
            coach.password = newPassword;
            await coach.save();
            return true;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Set reset password authentication data
     * @param email Coach email
     * @param oneTimeCode One time code
     * @param expireAt Expiration time
     * @returns Success status
     */
    async setResetPasswordData(email, oneTimeCode, expireAt) {
        try {
            const coach = await this.model.findOneAndUpdate({ email }, {
                $set: {
                    'authentication.isResetPassword': true,
                    'authentication.oneTimeCode': oneTimeCode,
                    'authentication.expireAt': expireAt,
                },
            }, { new: true });
            return !!coach;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Reset password using one-time code
     * @param email Coach email
     * @param oneTimeCode One time code
     * @param newPassword New password
     * @returns Success status
     */
    async resetPassword(email, oneTimeCode, newPassword) {
        try {
            const coach = await this.model.findOne({ email });
            if (!coach) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Coach not found');
            }
            // Check if reset password is requested and code is valid
            if (!coach.authentication?.isResetPassword ||
                coach.authentication.oneTimeCode !== oneTimeCode ||
                !coach.authentication.expireAt ||
                coach.authentication.expireAt < new Date()) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid or expired reset code');
            }
            // Update password and clear reset data
            coach.password = newPassword;
            coach.authentication.isResetPassword = false;
            coach.authentication.oneTimeCode = null;
            coach.authentication.expireAt = null;
            await coach.save();
            return true;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.CoachService = CoachService;
