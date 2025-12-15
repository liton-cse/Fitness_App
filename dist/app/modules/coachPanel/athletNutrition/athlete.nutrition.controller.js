"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AthleteNutritionPlanController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const athlete_nutrition_service_1 = require("./athlete.nutrition.service");
const nutritionService = new athlete_nutrition_service_1.AthleteNutritionPlanService();
class AthleteNutritionPlanController {
    constructor() {
        /**
         * Add a new nutrition plan
         * POST /api/v1/nutrition-plans
         */
        this.addNutritionPlan = (0, catchAsync_1.default)(async (req, res, next) => {
            const athleteId = req.params.id;
            const payload = {
                ...req.body,
                athleteId,
            };
            console.log(payload);
            const result = await nutritionService.createNutritionPlan(payload);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: 'Nutrition plan created successfully',
                data: result,
            });
        });
        /**
         * Get all nutrition plans with optional search & filter
         * GET /api/v1/nutrition-plans?mealName=&trainingDay=
         */
        this.getNutritionPlans = (0, catchAsync_1.default)(async (req, res, next) => {
            const filters = {
                mealName: req.query.mealName,
                trainingDay: req.query.trainingDay,
            };
            const athleteId = req.user.id;
            const result = await nutritionService.getNutritionPlans(filters, athleteId);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Nutrition plans fetched successfully',
                data: result,
            });
        });
        /**
         * Get single nutrition plan by ID
         * GET /api/v1/nutrition-plans/:id
         */
        this.getNutritionPlanById = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await nutritionService.getNutritionPlanById(req.params.id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Nutrition plan fetched successfully',
                data: result,
            });
        });
        /**
         * Update nutrition plan by ID
         * PATCH /api/v1/nutrition-plans/:id
         */
        this.updateNutritionPlan = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await nutritionService.updateNutritionPlan(req.params.id, req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Nutrition plan updated successfully',
                data: result,
            });
        });
        /**
         * Delete nutrition plan by ID
         * DELETE /api/v1/nutrition-plans/:id
         */
        this.deleteNutritionPlan = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await nutritionService.deleteNutritionPlan(req.params.id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Nutrition plan deleted successfully',
                data: result,
            });
        });
    }
}
exports.AthleteNutritionPlanController = AthleteNutritionPlanController;
