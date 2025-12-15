"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInRoter = void 0;
const express_1 = require("express");
const checkin_controller_1 = require("./checkin.controller");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const user_1 = require("../../../../enums/user");
const fileUploadHandler_1 = __importDefault(require("../../../middlewares/fileUploadHandler"));
const router = (0, express_1.Router)();
const controller = new checkin_controller_1.CheckInController();
// Create a new Check-in
router.post('/', (0, auth_1.default)(user_1.USER_ROLES.ATHLETE), (0, fileUploadHandler_1.default)(), controller.createCheckIn);
// Get all Check-ins for the logged-in user
router.get('/', (0, auth_1.default)(user_1.USER_ROLES.ATHLETE, user_1.USER_ROLES.SUPER_ADMIN), controller.getAllCheckIns);
router.get('/date', (0, auth_1.default)(user_1.USER_ROLES.ATHLETE, user_1.USER_ROLES.SUPER_ADMIN), controller.getNextCheckInDate);
// Get a single Check-in by ID
router.get('/:id', controller.getCheckInById);
// Update a Check-in by ID
router.patch('/:id', (0, auth_1.default)(user_1.USER_ROLES.COACH), controller.updateCheckIn);
// Delete a Check-in by ID
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), controller.deleteCheckIn);
exports.CheckInRoter = router;
