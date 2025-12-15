"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AthleteAuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const jwtHelper_1 = require("../../../../helpers/jwtHelper");
const config_1 = __importDefault(require("../../../../config"));
const generateOTP_1 = __importDefault(require("../../../../util/generateOTP"));
const emailTemplate_1 = require("../../../../shared/emailTemplate");
const emailHelper_1 = require("../../../../helpers/emailHelper");
const cryptoToken_1 = __importDefault(require("../../../../util/cryptoToken"));
const resetToken_model_1 = require("../../resetToken/resetToken.model");
const athleteModel_1 = require("./athleteModel");
class AthleteAuthService {
    /**
     * Login athlete with email and password
     */
    async loginAthleteFromDB(payload) {
        const { email, password } = payload;
        const isExistAthlete = await athleteModel_1.AthleteModel.findOne({ email }).select('+password');
        if (!isExistAthlete) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Athlete doesn't exist!");
        }
        if (password &&
            !(await athleteModel_1.AthleteModel.isMatchPassword(password, isExistAthlete.password))) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is incorrect!');
        }
        // if (isExistAthlete.isActive === 'In-Active') {
        //   throw new ApiError(StatusCodes.FORBIDDEN, 'Your account is deactivated');
        // }
        await athleteModel_1.AthleteModel.findByIdAndUpdate(isExistAthlete._id, {
            isActive: 'Active',
            lastActive: new Date(),
        });
        const createToken = jwtHelper_1.jwtHelper.createToken({
            id: isExistAthlete._id,
            email: isExistAthlete.email,
            name: isExistAthlete.name,
            role: isExistAthlete.role,
        }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expire_in);
        const { password: athletePassword, ...athleteData } = isExistAthlete.toObject();
        return {
            token: createToken,
        };
    }
    /**
     * Send OTP for password reset
     */
    async forgetPasswordToDB(email) {
        const isExistAthlete = await athleteModel_1.AthleteModel.isExistAthleteByEmail(email);
        if (!isExistAthlete) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Athlete doesn't exist!");
        }
        const otp = (0, generateOTP_1.default)();
        const value = {
            otp,
            email: isExistAthlete.email,
            name: isExistAthlete.name,
        };
        const forgetPasswordEmail = emailTemplate_1.emailTemplate.resetPassword(value);
        emailHelper_1.emailHelper.sendEmail(forgetPasswordEmail);
        const authentication = {
            oneTimeCode: otp,
            expireAt: new Date(Date.now() + 3 * 60000),
        };
        await athleteModel_1.AthleteModel.findOneAndUpdate({ email }, { $set: { authentication } });
        return {
            message: 'Password reset OTP sent to your email',
            otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        };
    }
    /**
     * Verify email with OTP
     */
    async verifyEmailToDB(payload) {
        const { email, oneTimeCode } = payload;
        const isExistAthlete = await athleteModel_1.AthleteModel.findOne({ email }).select('+authentication');
        if (!isExistAthlete) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Athlete doesn't exist!");
        }
        if (!oneTimeCode) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please provide the OTP sent to your email');
        }
        if (isExistAthlete.authentication?.oneTimeCode !== oneTimeCode) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid OTP');
        }
        if (new Date() > (isExistAthlete.authentication?.expireAt || new Date())) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'OTP expired. Please request a new one');
        }
        let message;
        let data;
        if (!isExistAthlete.verified) {
            await athleteModel_1.AthleteModel.findByIdAndUpdate(isExistAthlete._id, {
                verified: true,
                authentication: { oneTimeCode: null, expireAt: null },
            });
            message = 'Email verified successfully';
        }
        else {
            await athleteModel_1.AthleteModel.findByIdAndUpdate(isExistAthlete._id, {
                authentication: {
                    isResetPassword: true,
                    oneTimeCode: null,
                    expireAt: null,
                },
            });
            const createToken = (0, cryptoToken_1.default)();
            await resetToken_model_1.ResetToken.create({
                user: isExistAthlete._id,
                token: createToken,
                expireAt: new Date(Date.now() + 5 * 60000),
            });
            message = 'Verification successful. Use this code to reset your password';
            data = createToken;
        }
        return { data, message };
    }
    /**
     * Reset password using reset token
     */
    async resetPasswordToDB(token, payload) {
        const { newPassword, confirmPassword } = payload;
        const isExistToken = await resetToken_model_1.ResetToken.isExistToken(token);
        if (!isExistToken) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid reset token');
        }
        const isExistAthlete = await athleteModel_1.AthleteModel.findById(isExistToken.user).select('+authentication');
        if (!isExistAthlete?.authentication?.isResetPassword) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'No permission to reset password');
        }
        const isValid = await resetToken_model_1.ResetToken.isExpireToken(token);
        if (!isValid) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Reset token expired');
        }
        if (newPassword !== confirmPassword) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Passwords don't match");
        }
        const hashPassword = await bcryptjs_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
        await athleteModel_1.AthleteModel.findByIdAndUpdate(isExistToken.user, {
            password: hashPassword,
            authentication: {
                isResetPassword: false,
                oneTimeCode: null,
                expireAt: null,
            },
        });
        await resetToken_model_1.ResetToken.deleteOne({ token });
        return { message: 'Password reset successfully' };
    }
    /**
     * Change password for authenticated athlete
     */
    async changePasswordToDB(user, payload) {
        const { currentPassword, newPassword, confirmPassword } = payload;
        const isExistAthlete = await athleteModel_1.AthleteModel.findById(user.id).select('+password');
        if (!isExistAthlete)
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Athlete doesn't exist!");
        if (currentPassword &&
            !(await athleteModel_1.AthleteModel.isMatchPassword(currentPassword, isExistAthlete.password))) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Current password is incorrect');
        }
        if (currentPassword === newPassword) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'New password must be different');
        }
        if (newPassword !== confirmPassword) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Passwords don't match");
        }
        const hashPassword = await bcryptjs_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
        await athleteModel_1.AthleteModel.findByIdAndUpdate(user.id, { password: hashPassword });
        return { message: 'Password changed successfully' };
    }
    /**
     * Get athlete profile
     */
    async getProfile(user) {
        const athlete = await athleteModel_1.AthleteModel.findById(user.id)
            .select('-password -authentication')
            .lean();
        if (!athlete)
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Athlete not found');
        return athlete;
    }
    /**
     * Update athlete profile
     */
    async updateProfile(user, updateData) {
        const { password, email, ...safeUpdate } = updateData;
        const athlete = await athleteModel_1.AthleteModel.findByIdAndUpdate(user.id, { $set: safeUpdate }, { new: true, runValidators: true })
            .select('-password -authentication')
            .lean();
        if (!athlete)
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Athlete not found');
        return athlete;
    }
    /**
     * Logout athlete
     */
    async logoutAthlete(user) {
        await athleteModel_1.AthleteModel.findByIdAndUpdate(user.id, { lastActive: new Date() });
        return { message: 'Logged out successfully' };
    }
    /**
     * Request email verification OTP
     */
    async requestEmailVerification(email) {
        const isExistAthlete = await athleteModel_1.AthleteModel.isExistAthleteByEmail(email);
        if (!isExistAthlete)
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Athlete doesn't exist!");
        if (isExistAthlete.verified)
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email already verified');
        const otp = (0, generateOTP_1.default)();
        const value = {
            otp,
            email: isExistAthlete.email,
            name: isExistAthlete.name,
        };
        const verificationEmail = emailTemplate_1.emailTemplate.resetPassword(value);
        emailHelper_1.emailHelper.sendEmail(verificationEmail);
        const authentication = {
            oneTimeCode: otp,
            expireAt: new Date(Date.now() + 10 * 60000),
        };
        await athleteModel_1.AthleteModel.findOneAndUpdate({ email }, { $set: { authentication } });
        return {
            message: 'Verification OTP sent to your email',
            otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        };
    }
}
exports.AthleteAuthService = AthleteAuthService;
