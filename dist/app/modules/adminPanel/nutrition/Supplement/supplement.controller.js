"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplementItemController = void 0;
const http_status_codes_1 = require("http-status-codes");
const supplement_service_1 = require("./supplement.service");
const catchAsync_1 = __importDefault(require("../../../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../../../shared/sendResponse"));
const supplementService = new supplement_service_1.SupplementItemService();
class SupplementItemController {
    constructor() {
        /**
         * Add new supplement
         * POST /api/v1/supplements
         */
        this.addSupplement = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await supplementService.createSupplement(req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: 'Supplement created successfully',
                data: result,
            });
        });
        /**
         * Get all supplements with optional search and pagination
         * GET /api/v1/supplements?search=&page=&limit=
         */
        this.getAllSupplements = (0, catchAsync_1.default)(async (req, res, next) => {
            const { search, page, limit } = req.query;
            const result = await supplementService.getAllSupplements(search, Number(page) || 1, Number(limit) || 10);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Supplements retrieved successfully',
                data: result,
            });
        });
        /**
         * Get supplement by ID
         * GET /api/v1/supplements/:id
         */
        this.getSupplementById = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await supplementService.getSupplementById(req.params.id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Supplement retrieved successfully',
                data: result,
            });
        });
        /**
         * Update supplement by ID
         * PATCH /api/v1/supplements/:id
         */
        this.updateSupplement = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await supplementService.updateSupplement(req.params.id, req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Supplement updated successfully',
                data: result,
            });
        });
        /**
         * Delete supplement by ID
         * DELETE /api/v1/supplements/:id
         */
        this.deleteSupplement = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await supplementService.deleteSupplement(req.params.id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Supplement deleted successfully',
                data: result,
            });
        });
    }
}
exports.SupplementItemController = SupplementItemController;
