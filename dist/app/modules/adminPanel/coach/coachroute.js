"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coachRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../../enums/user");
const coachController_1 = require("./coachController");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const fileUploadHandler_1 = __importDefault(require("../../../middlewares/fileUploadHandler"));
const router = express_1.default.Router();
const coachController = new coachController_1.CoachController();
// Public routes
router.post('/request-password-reset', coachController.requestPasswordReset);
router.post('/reset-password', coachController.resetPassword);
// Protected routes
/**
 * @route   GET /api/v1/coaches
 * @desc    Get all coaches with pagination
 * @access  Private (Admin only)
 */
router.get('/', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), coachController.getAll);
/**
 * @route   GET /api/v1/coaches/:id
 * @desc    Get single coach by ID
 * @access  Private (Coach or Admin)
 */
router.get('/:id', (0, auth_1.default)(user_1.USER_ROLES.COACH, user_1.USER_ROLES.SUPER_ADMIN), coachController.getById);
/**
 * @route   POST /api/v1/coaches
 * @desc    Create a new coach
 * @access  Public (for registration) or Private (Admin)
 */
router.post('/', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploadHandler_1.default)(), coachController.create);
/**
 * @route   PATCH /api/v1/coaches/:id
 * @desc    Update coach by ID
 * @access  Private (Coach or Admin)
 */
router.patch('/:id', (0, auth_1.default)(user_1.USER_ROLES.COACH, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploadHandler_1.default)(), coachController.update);
/**
 * @route   DELETE /api/v1/coaches/:id
 * @desc    Delete coach (soft delete)
 * @access  Private (Admin only)
 */
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.COACH), coachController.delete);
/**
 * @route   PATCH /api/v1/coaches/:id/verify
 * @desc    Verify coach account
 * @access  Private (Admin only)
 */
router.patch('/:id/verify', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), coachController.verifyCoach);
/**
 * @route   PATCH /api/v1/coaches/:id/last-active
 * @desc    Update coach last active timestamp
 * @access  Private (Coach only)
 */
router.patch('/:id/last-active', (0, auth_1.default)(user_1.USER_ROLES.COACH), coachController.updateLastActive);
/**
 * @route   PATCH /api/v1/coaches/:id/change-password
 * @desc    Change coach password
 * @access  Private (Coach only)
 */
router.patch('/:id/change-password', (0, auth_1.default)(user_1.USER_ROLES.COACH), coachController.changePassword);
exports.coachRoutes = router;
