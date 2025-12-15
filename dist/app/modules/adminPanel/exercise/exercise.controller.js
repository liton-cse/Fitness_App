"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const getFilePath_1 = require("../../../../shared/getFilePath");
const exercise_service_1 = require("./exercise.service");
const exerciseService = new exercise_service_1.ExerciseService();
class ExerciseController {
    constructor() {
        /**
         * Add new exercise
         * POST /api/v1/exercises
         */
        this.addExercise = (0, catchAsync_1.default)(async (req, res, next) => {
            const image = (0, getFilePath_1.getSingleFilePath)(req.files, 'image');
            const vedio = (0, getFilePath_1.getSingleFilePath)(req.files, 'vedio');
            const data = {
                ...req.body,
                image,
                vedio,
            };
            const result = await exerciseService.createExercise(data);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: 'Exercise created successfully',
                data: result,
            });
        });
        /**
         * Get all exercises with pagination, search, filter by musalCategory
         * GET /api/v1/exercises
         */
        this.getAllExercises = (0, catchAsync_1.default)(async (req, res, next) => {
            const { page = '1', limit = '10', search, musalCategory } = req.query;
            const result = await exerciseService.getAllExercises(Number(page), Number(limit), search, musalCategory);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Exercises fetched successfully',
                data: result,
            });
        });
        /**
         * Get exercise by ID
         * GET /api/v1/exercises/:id
         */
        this.getExerciseById = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await exerciseService.getExerciseById(req.params.id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Exercise fetched successfully',
                data: result,
            });
        });
        /**
         * Update exercise by ID
         * PUT /api/v1/exercises/:id
         */
        this.updateExercise = (0, catchAsync_1.default)(async (req, res, next) => {
            const image = (0, getFilePath_1.getSingleFilePath)(req.files, 'image');
            const vedio = (0, getFilePath_1.getSingleFilePath)(req.files, 'vedio');
            const data = {
                ...req.body,
                ...(image && { image }),
                ...(vedio && { vedio }),
            };
            const result = await exerciseService.updateExercise(req.params.id, data);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Exercise updated successfully',
                data: result,
            });
        });
        /**
         * Delete exercise by ID
         * DELETE /api/v1/exercises/:id
         */
        this.deleteExercise = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await exerciseService.deleteExercise(req.params.id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Exercise deleted successfully',
                data: result,
            });
        });
    }
}
exports.ExerciseController = ExerciseController;
