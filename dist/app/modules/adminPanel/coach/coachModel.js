"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoachModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const user_1 = require("../../../../enums/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../../../config"));
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const coachSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    role: {
        type: String,
        enum: Object.values(user_1.USER_ROLES),
        default: user_1.USER_ROLES.COACH,
        required: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    image: {
        type: String,
        default: 'https://i.ibb.co/z5YHLV9/profile.png',
    },
    verified: {
        type: Boolean,
        default: true,
    },
    isActive: {
        type: String,
        enum: ['Active', 'In-Active'],
        default: 'In-Active',
    },
    lastActive: {
        type: Date,
        default: Date.now,
    },
    authentication: {
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
}, {
    timestamps: true,
});
//exist user check
coachSchema.statics.isExistCoachById = async (id) => {
    const isExist = await exports.CoachModel.findById(id);
    return isExist;
};
coachSchema.statics.isExistCoachByEmail = async (email) => {
    const isExist = await exports.CoachModel.findOne({ email });
    return isExist;
};
//is match password
coachSchema.statics.isMatchPassword = async (password, hashPassword) => {
    return await bcryptjs_1.default.compare(password, hashPassword);
};
//check user
coachSchema.pre('save', async function () {
    const user = this;
    // Check if email exists
    const isExist = await exports.CoachModel.findOne({ email: user.email });
    if (isExist) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email already exists!');
    }
    // Hash password
    user.password = await bcryptjs_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
});
exports.CoachModel = mongoose_1.default.model('Coach', coachSchema);
