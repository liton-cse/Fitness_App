"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AthleteController = void 0;
const http_status_codes_1 = require("http-status-codes");
const athleteservice_1 = require("./athleteservice");
const catchAsync_1 = __importDefault(require("../../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const getFilePath_1 = require("../../../../shared/getFilePath");
const athleteService = new athleteservice_1.AthleteService();
class AthleteController {
    constructor() {
        this.create = (0, catchAsync_1.default)(async (req, res, next) => {
            let image = (0, getFilePath_1.getSingleFilePath)(req.files, 'image');
            const data = {
                ...req.body,
                image,
            };
            const result = await athleteService.createAthlete(data);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: 'Athlete created successfully',
                data: result,
            });
        });
        this.getAll = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await athleteService.getAllAthletes();
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'All athletes fetched successfully',
                data: result,
            });
        });
        this.getOne = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await athleteService.getAthleteById(req.params.id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Single athlete fetched successfully',
                data: result,
            });
        });
        this.update = (0, catchAsync_1.default)(async (req, res, next) => {
            let image = (0, getFilePath_1.getSingleFilePath)(req.files, 'image');
            const data = {
                ...req.body,
                image,
            };
            const result = await athleteService.updateAthlete(req.params.id, data);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Athlete updated successfully',
                data: result,
            });
        });
        // delete athlete
        this.delete = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await athleteService.deleteAthlete(req.params.id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Athlete deleted successfully',
                data: result,
            });
        });
        //update check in date
        this.checkIn = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await athleteService.checkIn(req.params.id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Check-in updated successfully',
                data: result,
            });
        });
        //Update the athlete status..
        this.updateStatus = (0, catchAsync_1.default)(async (req, res, next) => {
            const id = req.user.id;
            const result = await athleteService.updateActiveStatus(id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Athlete status updated successfully',
                data: result,
            });
        });
        //get athlete profile from db...
        this.getAthleteProfile = (0, catchAsync_1.default)(async (req, res) => {
            const user = req.user;
            const result = await athleteService.getUserProfileFromDB(user);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Profile data retrieved successfully',
                data: result,
            });
        });
        //update profile of the athlete
        this.updateProfile = (0, catchAsync_1.default)(async (req, res, next) => {
            const user = req.user;
            let image = (0, getFilePath_1.getSingleFilePath)(req.files, 'image');
            const data = {
                image,
                ...req.body,
            };
            const result = await athleteService.updateProfileToDB(user, data);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Profile updated successfully',
                data: result,
            });
        });
    }
}
exports.AthleteController = AthleteController;
