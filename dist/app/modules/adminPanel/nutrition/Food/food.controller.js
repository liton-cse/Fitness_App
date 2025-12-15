"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodItemController = void 0;
const http_status_codes_1 = require("http-status-codes");
const food_service_1 = require("./food.service");
const catchAsync_1 = __importDefault(require("../../../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../../../shared/sendResponse"));
const foodService = new food_service_1.FoodItemService();
class FoodItemController {
    constructor() {
        /**
         * Add new food item
         * POST /api/v1/food-items
         */
        this.addFoodItem = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await foodService.createFoodItem(req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: 'Food item created successfully',
                data: result,
            });
        });
        /**
         * Get all food items
         * GET /api/v1/food-items?search=&page=&limit=
         */
        this.getAllFoodItems = (0, catchAsync_1.default)(async (req, res, next) => {
            const { search, page, limit, filter } = req.query;
            const result = await foodService.getAllFoodItems(search, Number(page) || 1, Number(limit) || 10, filter);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Food items retrieved successfully',
                data: result,
            });
        });
        /**
         * Get food item by ID
         * GET /api/v1/food-items/:id
         */
        this.getFoodItemById = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await foodService.getFoodItemById(req.params.id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Food item retrieved successfully',
                data: result,
            });
        });
        /**
         * Update food item by ID
         * PATCH /api/v1/food-items/:id
         */
        this.updateFoodItem = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await foodService.updateFoodItem(req.params.id, req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Food item updated successfully',
                data: result,
            });
        });
        /**
         * Delete food item by ID
         * DELETE /api/v1/food-items/:id
         */
        this.deleteFoodItem = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await foodService.deleteFoodItem(req.params.id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Food item deleted successfully',
                data: result,
            });
        });
    }
}
exports.FoodItemController = FoodItemController;
