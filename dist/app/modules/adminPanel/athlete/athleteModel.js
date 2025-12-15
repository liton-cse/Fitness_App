"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AthleteModel = void 0;
const mongoose_1 = require("mongoose");
const user_1 = require("../../../../enums/user");
const config_1 = __importDefault(require("../../../../config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const athleteSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(user_1.USER_ROLES),
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: 0,
        minlength: 8,
    },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    category: { type: String, required: true },
    phase: { type: String, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    image: {
        type: String,
        default: 'https://i.ibb.co/z5YHLV9/profile.png',
    },
    age: { type: Number, required: true },
    status: { type: String, enum: ['Natural', 'Enhanced'], required: true },
    trainingDaySteps: { type: Number, required: true },
    restDaySteps: { type: Number, required: true },
    checkInDay: { type: String, required: true },
    goal: { type: String, required: true },
    verified: {
        type: Boolean,
        default: true,
    },
    lastCheckIn: { type: Date },
    isActive: {
        type: String,
        enum: ['Active', 'In-Active'],
        default: 'In-Active',
    },
    lastActive: { type: Date },
    authentication: {
        type: {
            isResetPassword: {
                type: Boolean,
                default: false,
            },
            oneTimeCode: {
                type: Number,
                default: null,
            },
            expireAt: {
                type: Date,
                default: null,
            },
        },
        select: 0,
    },
}, { timestamps: true });
//exist user check
athleteSchema.statics.isExistAthleteById = async (id) => {
    const isExist = await exports.AthleteModel.findById(id);
    return isExist;
};
athleteSchema.statics.isExistAthleteByEmail = async (email) => {
    const isExist = await exports.AthleteModel.findOne({ email });
    return isExist;
};
//is match password
athleteSchema.statics.isMatchPassword = async (password, hashPassword) => {
    return await bcryptjs_1.default.compare(password, hashPassword);
};
//check user
athleteSchema.pre('save', async function () {
    const user = this;
    // Check if email exists
    const isExist = await exports.AthleteModel.findOne({ email: user.email });
    if (isExist) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email already exists!');
    }
    // Hash password
    user.password = await bcryptjs_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
});
exports.AthleteModel = (0, mongoose_1.model)('Athlete', athleteSchema);
