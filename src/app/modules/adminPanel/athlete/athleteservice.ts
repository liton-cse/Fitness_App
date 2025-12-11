import { StatusCodes } from 'http-status-codes';
import { USER_ROLES } from '../../../../enums/user';
import ApiError from '../../../../errors/ApiError';
import { IAthlete } from './athleteInterface';
import { AthleteModel } from './athleteModel';
import generateOTP from '../../../../util/generateOTP';
import { emailTemplate } from '../../../../shared/emailTemplate';
import { emailHelper } from '../../../../helpers/emailHelper';
import { JwtPayload } from 'jsonwebtoken';
import unlinkFile from '../../../../shared/unlinkFile';

export class AthleteService {
  async createAthlete(data: IAthlete) {
    data.role = USER_ROLES.ATHLETE;
    const createAthlete = await AthleteModel.create(data);
    if (!createAthlete) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Athlete');
    }

    //send email
    const otp = generateOTP();
    const values = {
      name: createAthlete.name,
      otp: otp,
      email: createAthlete.email!,
    };
    const createAccountTemplate = emailTemplate.createAccount(values);
    emailHelper.sendEmail(createAccountTemplate);

    //save to DB
    const authentication = {
      oneTimeCode: otp,
      expireAt: new Date(Date.now() + 3 * 60000),
    };
    await AthleteModel.findOneAndUpdate(
      { _id: createAthlete._id },
      { $set: { authentication } }
    );

    return createAthlete;
  }

  async getAllAthletes() {
    return await AthleteModel.find();
  }

  async getAthleteById(id: string) {
    return await AthleteModel.findById(id);
  }

  async updateAthlete(id: string, data: Partial<IAthlete>) {
    return await AthleteModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteAthlete(id: string) {
    return await AthleteModel.findByIdAndDelete(id);
  }

  async checkIn(id: string) {
    return await AthleteModel.findByIdAndUpdate(
      id,
      { lastCheckIn: new Date() },
      { new: true }
    );
  }

  async updateActiveStatus(id: string) {
    return await AthleteModel.findByIdAndUpdate(
      id,
      {
        isActive: 'In-Active',
        lastActive: new Date(),
      },
      { new: true }
    );
  }

  async setActiveOnLogin(id: string) {
    return await AthleteModel.findByIdAndUpdate(
      id,
      {
        isActive: 'Active',
        lastActive: new Date(),
      },
      { new: true }
    );
  }

  async getUserProfileFromDB(user: JwtPayload): Promise<Partial<IAthlete>> {
    const { id } = user;
    const isExistAthlete = await AthleteModel.isExistAthleteById(id);
    if (!isExistAthlete) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    return isExistAthlete;
  }

  updateProfileToDB = async (
    user: JwtPayload,
    payload: Partial<IAthlete>
  ): Promise<Partial<IAthlete | null>> => {
    const { id } = user;
    const isExistUser = await AthleteModel.isExistAthleteById(id);
    if (!isExistUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Athlete doesn't exist!");
    }

    //unlink file here
    if (payload.image) {
      unlinkFile(isExistUser.image);
    }

    const updateDoc = await AthleteModel.findOneAndUpdate(
      { _id: id },
      payload,
      {
        new: true,
      }
    );

    return updateDoc;
  };
}
