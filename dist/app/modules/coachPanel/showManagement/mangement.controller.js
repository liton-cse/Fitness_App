"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowManagementController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const management_service_1 = require("./management.service");
const showService = new management_service_1.ShowManagementService();
class ShowManagementController {
    constructor() {
        /**
         * Add a new show
         * POST /api/v1/shows
         */
        this.addShow = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await showService.createShow(req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: 'Show created successfully',
                data: result,
            });
        });
        /**
         * Get all shows (latest first)
         * GET /api/v1/shows
         */
        this.getAllShows = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await showService.getAllShows();
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Shows retrieved successfully',
                data: result,
            });
        });
        /**
         * Get a single show by ID
         * GET /api/v1/shows/:id
         */
        this.getShowById = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await showService.getShowById(req.params.id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Show retrieved successfully',
                data: result,
            });
        });
        /**
         * Update a show
         * PATCH /api/v1/shows/:id
         */
        this.updateShow = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await showService.updateShow(req.params.id, req.body);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Show updated successfully',
                data: result,
            });
        });
        /**
         * Delete a show
         * DELETE /api/v1/shows/:id
         */
        this.deleteShow = (0, catchAsync_1.default)(async (req, res, next) => {
            const result = await showService.deleteShow(req.params.id);
            (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Show deleted successfully',
                data: result,
            });
        });
    }
}
exports.ShowManagementController = ShowManagementController;
