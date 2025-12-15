"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoachAuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = require("http-status-codes");
const coachModel_1 = require("./coachModel");
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const jwtHelper_1 = require("../../../../helpers/jwtHelper");
const config_1 = __importDefault(require("../../../../config"));
const generateOTP_1 = __importDefault(require("../../../../util/generateOTP"));
const emailTemplate_1 = require("../../../../shared/emailTemplate");
const emailHelper_1 = require("../../../../helpers/emailHelper");
const cryptoToken_1 = __importDefault(require("../../../../util/cryptoToken"));
const resetToken_model_1 = require("../../resetToken/resetToken.model");
class CoachAuthService {
    /**
     * Login coach with email and password
     * @param payload Login credentials
     * @returns JWT token
     */
    async loginCoachFromDB(payload) {
        const { email, password } = payload;
        // Find coach by email with password field
        const isExistCoach = await coachModel_1.CoachModel.findOne({ email }).select('+password');
        if (!isExistCoach) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Coach doesn't exist!");
        }
        // Check if password matches
        if (password &&
            !(await coachModel_1.CoachModel.isMatchPassword(password, isExistCoach.password))) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is incorrect!');
        }
        // Check if coach is active
        if (isExistCoach.isActive === 'In-Active') {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Your account is deactivated');
        }
        // Update last active timestamp
        await coachModel_1.CoachModel.findByIdAndUpdate(isExistCoach._id, {
            lastActive: new Date(),
        });
        // Create JWT token
        const createToken = jwtHelper_1.jwtHelper.createToken({
            id: isExistCoach._id,
            role: isExistCoach.role,
            email: isExistCoach.email,
            name: isExistCoach.name,
        }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expire_in);
        // Remove sensitive data from response
        const { password: coachPassword, authentication, ...coachData } = isExistCoach.toObject();
        return {
            token: createToken,
            coach: coachData,
        };
    }
    /**
     * Send OTP for password reset
     * @param email Coach email
     * @returns Success message
     */
    async forgetPasswordToDB(email) {
        const isExistCoach = await coachModel_1.CoachModel.isExistCoachByEmail(email);
        if (!isExistCoach) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Coach doesn't exist!");
        }
        // Generate OTP
        const otp = (0, generateOTP_1.default)();
        // Prepare email content
        const value = {
            otp,
            email: isExistCoach.email,
            name: isExistCoach.name,
        };
        const forgetPasswordEmail = emailTemplate_1.emailTemplate.resetPassword(value);
        // Send email
        emailHelper_1.emailHelper.sendEmail(forgetPasswordEmail);
        // Save OTP to database with expiration (3 minutes)
        const authentication = {
            oneTimeCode: otp,
            expireAt: new Date(Date.now() + 3 * 60000),
        };
        await coachModel_1.CoachModel.findOneAndUpdate({ email }, { $set: { authentication } });
        return {
            message: 'Password reset OTP sent to your email',
            // In development, return OTP for testing
            otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        };
    }
    /**
     * Verify email with OTP
     * @param payload Email and OTP
     * @returns Verification result
     */
    async verifyEmailToDB(payload) {
        const { email, oneTimeCode } = payload;
        const isExistCoach = await coachModel_1.CoachModel.findOne({ email }).select('+authentication');
        if (!isExistCoach) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Coach doesn't exist!");
        }
        if (!oneTimeCode) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please provide the OTP sent to your email');
        }
        // Check if OTP matches
        if (isExistCoach.authentication?.oneTimeCode !== oneTimeCode) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid OTP');
        }
        // Check if OTP is expired
        const date = new Date();
        if (date > (isExistCoach.authentication?.expireAt || new Date())) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'OTP expired. Please request a new one');
        }
        let message;
        let data;
        // If coach is not verified, verify them
        if (!isExistCoach.verified) {
            await coachModel_1.CoachModel.findByIdAndUpdate(isExistCoach._id, {
                verified: true,
                authentication: { oneTimeCode: null, expireAt: null },
            });
            message = 'Email verified successfully';
        }
        else {
            // If already verified, prepare for password reset
            await coachModel_1.CoachModel.findByIdAndUpdate(isExistCoach._id, {
                authentication: {
                    isResetPassword: true,
                    oneTimeCode: null,
                    expireAt: null,
                },
            });
            // Create reset token
            const createToken = (0, cryptoToken_1.default)();
            await resetToken_model_1.ResetToken.create({
                user: isExistCoach._id,
                token: createToken,
                expireAt: new Date(Date.now() + 5 * 60000), // 5 minutes expiry
            });
            message = 'Verification successful. Use this code to reset your password';
            data = createToken;
        }
        return { data, message };
    }
    /**
     * Reset password using reset token
     * @param token Reset token
     * @param payload New password details
     * @returns Success message
     */
    async resetPasswordToDB(token, payload) {
        const { newPassword, confirmPassword } = payload;
        // Check if token exists
        const isExistToken = await resetToken_model_1.ResetToken.isExistToken(token);
        if (!isExistToken) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid reset token');
        }
        // Find coach and check reset permission
        const isExistCoach = await coachModel_1.CoachModel.findById(isExistToken.user).select('+authentication');
        if (!isExistCoach?.authentication?.isResetPassword) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You don't have permission to reset password. Please request a new reset");
        }
        // Check token expiry
        const isValid = await resetToken_model_1.ResetToken.isExpireToken(token);
        if (!isValid) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Reset token expired. Please request a new one');
        }
        // Validate passwords match
        if (newPassword !== confirmPassword) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "New password and confirm password don't match");
        }
        // Hash new password
        const hashPassword = await bcryptjs_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
        // Update coach password and clear reset flags
        const updateData = {
            password: hashPassword,
            authentication: {
                isResetPassword: false,
                oneTimeCode: null,
                expireAt: null,
            },
        };
        await coachModel_1.CoachModel.findByIdAndUpdate(isExistToken.user, updateData, {
            new: true,
        });
        // Delete used token
        await resetToken_model_1.ResetToken.deleteOne({ token });
        return { message: 'Password reset successfully' };
    }
    /**
     * Change password for authenticated coach
     * @param user JWT payload
     * @param payload Password change details
     * @returns Success message
     */
    async changePasswordToDB(user, payload) {
        const { currentPassword, newPassword, confirmPassword } = payload;
        // Find coach with password
        const isExistCoach = await coachModel_1.CoachModel.findById(user.id).select('+password');
        if (!isExistCoach) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Coach doesn't exist!");
        }
        // Verify current password
        if (currentPassword &&
            !(await coachModel_1.CoachModel.isMatchPassword(currentPassword, isExistCoach.password))) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Current password is incorrect');
        }
        // Check if new password is different from current
        if (currentPassword === newPassword) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'New password must be different from current password');
        }
        // Validate passwords match
        if (newPassword !== confirmPassword) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "New password and confirm password don't match");
        }
        // Hash new password
        const hashPassword = await bcryptjs_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
        // Update password
        const updateData = {
            password: hashPassword,
        };
        await coachModel_1.CoachModel.findByIdAndUpdate(user.id, updateData, { new: true });
        return { message: 'Password changed successfully' };
    }
    /**
     * Get current coach profile
     * @param user JWT payload
     * @returns Coach profile
     */
    async getProfile(user) {
        const coach = await coachModel_1.CoachModel.findById(user.id)
            .select('-password -authentication')
            .lean();
        if (!coach) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Coach not found');
        }
        return coach;
    }
    /**
     * Update coach profile
     * @param user JWT payload
     * @param updateData Profile update data
     * @returns Updated coach profile
     */
    async updateProfile(user, updateData) {
        // Remove sensitive fields that shouldn't be updated here
        const { password, email, role, ...safeUpdateData } = updateData;
        const coach = await coachModel_1.CoachModel.findByIdAndUpdate(user.id, { $set: safeUpdateData }, { new: true, runValidators: true })
            .select('-password -authentication')
            .lean();
        if (!coach) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Coach not found');
        }
        return coach;
    }
    /**
     * Logout coach (optional - can be handled client-side)
     * @param user JWT payload
     * @returns Success message
     */
    async logoutCoach(user) {
        // In a stateless JWT system, logout is handled client-side
        // But we can update last active timestamp
        await coachModel_1.CoachModel.findByIdAndUpdate(user.id, { lastActive: new Date() });
        return { message: 'Logged out successfully' };
    }
    /**
     * Request email verification OTP
     * @param email Coach email
     * @returns Success message
     */
    async requestEmailVerification(email) {
        const isExistCoach = await coachModel_1.CoachModel.isExistCoachByEmail(email);
        if (!isExistCoach) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Coach doesn't exist!");
        }
        // Check if already verified
        if (isExistCoach.verified) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email already verified');
        }
        // Generate OTP
        const otp = (0, generateOTP_1.default)();
        // Prepare email content
        const value = {
            otp,
            email: isExistCoach.email,
            name: isExistCoach.name,
        };
        const verificationEmail = emailTemplate_1.emailTemplate.resetPassword(value);
        // Send email
        emailHelper_1.emailHelper.sendEmail(verificationEmail);
        // Save OTP to database
        const authentication = {
            oneTimeCode: otp,
            expireAt: new Date(Date.now() + 10 * 60000), // 10 minutes expiry
        };
        await coachModel_1.CoachModel.findOneAndUpdate({ email }, { $set: { authentication } });
        return {
            message: 'Verification OTP sent to your email',
            otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        };
    }
}
exports.CoachAuthService = CoachAuthService;
