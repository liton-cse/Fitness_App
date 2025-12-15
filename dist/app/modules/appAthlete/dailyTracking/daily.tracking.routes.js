"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyTrackingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const daily_tracking_controller_1 = require("./daily.tracking.controller");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const user_1 = require("../../../../enums/user");
const router = express_1.default.Router();
const controller = new daily_tracking_controller_1.DailyTrackingController();
/**
 * Daily Tracking Routes
 */
router.post('/', (0, auth_1.default)(user_1.USER_ROLES.ATHLETE), controller.createDailyTracking);
router.get('/', (0, auth_1.default)(user_1.USER_ROLES.ATHLETE, user_1.USER_ROLES.COACH), controller.getAllDailyTracking);
router.get('/:id', controller.getSingleDailyTracking);
router.put('/:id', (0, auth_1.default)(user_1.USER_ROLES.COACH, user_1.USER_ROLES.ATHLETE), controller.updateDailyTracking);
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLES.COACH, user_1.USER_ROLES.SUPER_ADMIN), controller.deleteDailyTracking);
exports.DailyTrackingRoutes = router;
