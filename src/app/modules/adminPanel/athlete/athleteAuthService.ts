import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import {
  IAuthResetPassword,
  IChangePassword,
  ILoginData,
  IVerifyEmail,
} from '../../../../types/auth';
import ApiError from '../../../../errors/ApiError';
import { jwtHelper } from '../../../../helpers/jwtHelper';
import config from '../../../../config';
import generateOTP from '../../../../util/generateOTP';
import { emailTemplate } from '../../../../shared/emailTemplate';
import { emailHelper } from '../../../../helpers/emailHelper';
import cryptoToken from '../../../../util/cryptoToken';
import { ResetToken } from '../../resetToken/resetToken.model';
import { AthleteModel } from './athleteModel';
import { NotificationService } from '../../notification/notification.service';

export class AthleteAuthService {
  /**
   * Login athlete with email and password
   */
  async loginAthleteFromDB(payload: ILoginData) {
    const { email, password, fcmToken } = payload;

    const isExistAthlete = await AthleteModel.findOne({ email }).select(
      '+password'
    );
    if (!isExistAthlete) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Athlete doesn't exist!");
    }

    // if (!fcmToken && isExistAthlete.role !== 'ATHLETE') {
    //   throw new ApiError(StatusCodes.BAD_REQUEST, 'FCM token Needed!');
    // }

    if (
      password &&
      !(await AthleteModel.isMatchPassword(password, isExistAthlete.password))
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!');
    }

    if (isExistAthlete.isActive === 'In-Active') {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Your account is deactivated');
    }

    await AthleteModel.findByIdAndUpdate(isExistAthlete._id, {
      isActive: 'Active',
      lastActive: new Date(),
    });

    const createToken = jwtHelper.createToken(
      {
        id: isExistAthlete._id,
        email: isExistAthlete.email,
        name: isExistAthlete.name,
        role: isExistAthlete.role,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.jwt_expire_in as string
    );

    const { password: athletePassword, ...athleteData } =
      isExistAthlete.toObject();

    // 2️⃣ Save FCM token if provided
    if (fcmToken && isExistAthlete.role !== 'SUPER_ADMIN') {
      console.log('Notification running');
      await NotificationService.saveFCMToken(
        isExistAthlete._id.toString(),
        isExistAthlete.name,
        isExistAthlete.email,
        fcmToken
      );
    }

    return {
      token: createToken,
    };
  }

  /**
   * Send OTP for password reset
   */
  async forgetPasswordToDB(email: string) {
    const isExistAthlete = await AthleteModel.isExistAthleteByEmail(email);
    if (!isExistAthlete) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Athlete doesn't exist!");
    }

    const otp = generateOTP();

    const value = {
      otp,
      email: isExistAthlete.email,
      name: isExistAthlete.name,
    };
    const forgetPasswordEmail = emailTemplate.resetPassword(value);

    emailHelper.sendEmail(forgetPasswordEmail);

    const authentication = {
      oneTimeCode: otp,
      expireAt: new Date(Date.now() + 3 * 60000),
    };
    await AthleteModel.findOneAndUpdate(
      { email },
      { $set: { authentication } }
    );

    return {
      message: 'Password reset OTP sent to your email',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    };
  }

  /**
   * Verify email with OTP
   */
  async verifyEmailToDB(payload: IVerifyEmail) {
    const { email, oneTimeCode } = payload;
    const isExistAthlete = await AthleteModel.findOne({ email }).select(
      '+authentication'
    );
    if (!isExistAthlete) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Athlete doesn't exist!");
    }

    if (!oneTimeCode) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Please provide the OTP sent to your email'
      );
    }

    if (isExistAthlete.authentication?.oneTimeCode !== oneTimeCode) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid OTP');
    }

    if (new Date() > (isExistAthlete.authentication?.expireAt || new Date())) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'OTP expired. Please request a new one'
      );
    }

    let message;
    let data;

    if (!isExistAthlete.verified) {
      await AthleteModel.findByIdAndUpdate(isExistAthlete._id, {
        verified: true,
        authentication: { oneTimeCode: null, expireAt: null },
      });
      message = 'Email verified successfully';
    } else {
      await AthleteModel.findByIdAndUpdate(isExistAthlete._id, {
        authentication: {
          isResetPassword: true,
          oneTimeCode: null,
          expireAt: null,
        },
      });

      const createToken = cryptoToken();
      await ResetToken.create({
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
  async resetPasswordToDB(token: string, payload: IAuthResetPassword) {
    const { newPassword, confirmPassword } = payload;

    const isExistToken = await ResetToken.isExistToken(token);
    if (!isExistToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid reset token');
    }

    const isExistAthlete = await AthleteModel.findById(
      isExistToken.user
    ).select('+authentication');
    if (!isExistAthlete?.authentication?.isResetPassword) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'No permission to reset password'
      );
    }

    const isValid = await ResetToken.isExpireToken(token);
    if (!isValid) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Reset token expired');
    }

    if (newPassword !== confirmPassword) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Passwords don't match");
    }

    const hashPassword = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt_rounds)
    );

    await AthleteModel.findByIdAndUpdate(isExistToken.user, {
      password: hashPassword,
      authentication: {
        isResetPassword: false,
        oneTimeCode: null,
        expireAt: null,
      },
    });

    await ResetToken.deleteOne({ token });

    return { message: 'Password reset successfully' };
  }

  /**
   * Change password for authenticated athlete
   */
  async changePasswordToDB(user: JwtPayload, payload: IChangePassword) {
    const { currentPassword, newPassword, confirmPassword } = payload;

    const isExistAthlete = await AthleteModel.findById(user.id).select(
      '+password'
    );
    if (!isExistAthlete)
      throw new ApiError(StatusCodes.BAD_REQUEST, "Athlete doesn't exist!");

    if (
      currentPassword &&
      !(await AthleteModel.isMatchPassword(
        currentPassword,
        isExistAthlete.password
      ))
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Current password is incorrect'
      );
    }

    if (currentPassword === newPassword) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'New password must be different'
      );
    }

    if (newPassword !== confirmPassword) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Passwords don't match");
    }

    const hashPassword = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt_rounds)
    );

    await AthleteModel.findByIdAndUpdate(user.id, { password: hashPassword });

    return { message: 'Password changed successfully' };
  }

  /**
   * Get athlete profile
   */
  async getProfile(user: JwtPayload) {
    const athlete = await AthleteModel.findById(user.id)
      .select('-password -authentication')
      .lean();
    if (!athlete)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Athlete not found');
    return athlete;
  }

  /**
   * Update athlete profile
   */
  async updateProfile(user: JwtPayload, updateData: Partial<any>) {
    const { password, email, ...safeUpdate } = updateData;

    const athlete = await AthleteModel.findByIdAndUpdate(
      user.id,
      { $set: safeUpdate },
      { new: true, runValidators: true }
    )
      .select('-password -authentication')
      .lean();

    if (!athlete)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Athlete not found');
    return athlete;
  }

  /**
   * Logout athlete
   */
  async logoutAthlete(user: JwtPayload) {
    await AthleteModel.findByIdAndUpdate(user.id, { lastActive: new Date() });
    return { message: 'Logged out successfully' };
  }

  /**
   * Request email verification OTP
   */
  async requestEmailVerification(email: string) {
    const isExistAthlete = await AthleteModel.isExistAthleteByEmail(email);
    if (!isExistAthlete)
      throw new ApiError(StatusCodes.BAD_REQUEST, "Athlete doesn't exist!");
    if (isExistAthlete.verified)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already verified');

    const otp = generateOTP();
    const value = {
      otp,
      email: isExistAthlete.email,
      name: isExistAthlete.name,
    };
    const verificationEmail = emailTemplate.resetPassword(value);

    emailHelper.sendEmail(verificationEmail);

    const authentication = {
      oneTimeCode: otp,
      expireAt: new Date(Date.now() + 10 * 60000),
    };
    await AthleteModel.findOneAndUpdate(
      { email },
      { $set: { authentication } }
    );

    return {
      message: 'Verification OTP sent to your email',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    };
  }
}
