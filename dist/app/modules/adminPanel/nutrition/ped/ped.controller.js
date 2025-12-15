"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PEDInfoController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../../../shared/sendResponse"));
const ped_service_1 = require("./ped.service");
const pedService = new ped_service_1.PEDInfoService();
class PEDInfoController {
    constructor() {
        /**
         * Add new PED info
         * POST /api/v1/ped-info
         */
        this.addPEDInfo = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await pedService.createPEDInfo(req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: 'PED info created successfully',
                data: result,
            });
        });
        /**
         * Get all PED info (search + pagination)
         * GET /api/v1/ped-info
         */
        this.getAllPEDInfo = (0, catchAsync_1.default)(async (req, res, next) => {
            const { search = '', page = 1, limit = 10 } = req.query;
            const result = await pedService.getAllPEDInfo(search, Number(page), Number(limit));
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'PED info fetched successfully',
                data: result,
            });
        });
        /**
         * Get single PED info
         * GET /api/v1/ped-info/:id
         */
        this.getPEDInfoById = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await pedService.getPEDInfoById(req.params.id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'PED info fetched successfully',
                data: result,
            });
        });
        /**
         * Update PED info
         * PATCH /api/v1/ped-info/:id
         */
        this.updatePEDInfo = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await pedService.updatePEDInfo(req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'PED info updated successfully',
                data: result,
            });
        });
        /**
         * Delete PED info
         * DELETE /api/v1/ped-info/:id
         */
        this.deletePEDInfo = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await pedService.deletePEDInfo(req.params.id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'PED info deleted successfully',
                data: result,
            });
        });
    }
}
exports.PEDInfoController = PEDInfoController;
