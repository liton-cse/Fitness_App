"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoachAuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../../enums/user");
const coachAuthController_1 = require("./coachAuthController");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const router = express_1.default.Router();
const authController = new coachAuthController_1.CoachAuthController();
// Public routes
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-email', authController.verifyEmail);
router.post('/request-verification', authController.requestVerification);
router.post('/reset-password/:token', authController.resetPassword);
// Protected routes (require authentication)
router.get('/profile', (0, auth_1.default)(user_1.USER_ROLES.COACH), authController.getProfile);
router.patch('/profile', (0, auth_1.default)(user_1.USER_ROLES.COACH), authController.updateProfile);
router.patch('/change-password', (0, auth_1.default)(user_1.USER_ROLES.COACH), authController.changePassword);
router.post('/logout', (0, auth_1.default)(user_1.USER_ROLES.COACH), authController.logout);
exports.CoachAuthRoutes = router;
