"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AthleteService = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_1 = require("../../../../enums/user");
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const athleteModel_1 = require("./athleteModel");
const generateOTP_1 = __importDefault(require("../../../../util/generateOTP"));
const emailTemplate_1 = require("../../../../shared/emailTemplate");
const emailHelper_1 = require("../../../../helpers/emailHelper");
const unlinkFile_1 = __importDefault(require("../../../../shared/unlinkFile"));
class AthleteService {
    constructor() {
        this.updateProfileToDB = async (user, payload) => {
            const { id } = user;
            const isExistUser = await athleteModel_1.AthleteModel.isExistAthleteById(id);
            if (!isExistUser) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Athlete doesn't exist!");
            }
            //unlink file here
            if (payload.image) {
                (0, unlinkFile_1.default)(isExistUser.image);
            }
            const updateDoc = await athleteModel_1.AthleteModel.findOneAndUpdate({ _id: id }, payload, {
                new: true,
            });
            return updateDoc;
        };
    }
    async createAthlete(data) {
        data.role = user_1.USER_ROLES.ATHLETE;
        const createAthlete = await athleteModel_1.AthleteModel.create(data);
        if (!createAthlete) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create Athlete');
        }
        //send email
        const otp = (0, generateOTP_1.default)();
        const values = {
            name: createAthlete.name,
            otp: otp,
            email: createAthlete.email,
        };
        const createAccountTemplate = emailTemplate_1.emailTemplate.createAccount(values);
        emailHelper_1.emailHelper.sendEmail(createAccountTemplate);
        //save to DB
        const authentication = {
            oneTimeCode: otp,
            expireAt: new Date(Date.now() + 3 * 60000),
        };
        await athleteModel_1.AthleteModel.findOneAndUpdate({ _id: createAthlete._id }, { $set: { authentication } });
        return createAthlete;
    }
    async getAllAthletes() {
        return await athleteModel_1.AthleteModel.find();
    }
    async getAthleteById(id) {
        return await athleteModel_1.AthleteModel.findById(id);
    }
    async updateAthlete(id, data) {
        return await athleteModel_1.AthleteModel.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteAthlete(id) {
        return await athleteModel_1.AthleteModel.findByIdAndDelete(id);
    }
    async checkIn(id) {
        return await athleteModel_1.AthleteModel.findByIdAndUpdate(id, { lastCheckIn: new Date() }, { new: true });
    }
    async updateActiveStatus(id) {
        return await athleteModel_1.AthleteModel.findByIdAndUpdate(id, {
            isActive: 'In-Active',
            lastActive: new Date(),
        }, { new: true });
    }
    async setActiveOnLogin(id) {
        return await athleteModel_1.AthleteModel.findByIdAndUpdate(id, {
            isActive: 'Active',
            lastActive: new Date(),
        }, { new: true });
    }
    async getUserProfileFromDB(user) {
        const { id } = user;
        const isExistAthlete = await athleteModel_1.AthleteModel.isExistAthleteById(id);
        if (!isExistAthlete) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
        }
        return isExistAthlete;
    }
}
exports.AthleteService = AthleteService;
