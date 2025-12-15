"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AthleteRouter = void 0;
const express_1 = require("express");
const athleteController_1 = require("./athleteController");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const user_1 = require("../../../../enums/user");
const fileUploadHandler_1 = __importDefault(require("../../../middlewares/fileUploadHandler"));
const router = (0, express_1.Router)();
const controller = new athleteController_1.AthleteController();
router.post('/', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.COACH), (0, fileUploadHandler_1.default)(), controller.create);
router.get('/', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.COACH, user_1.USER_ROLES.ATHLETE), controller.getAll);
router.get('/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.COACH, user_1.USER_ROLES.ATHLETE), controller.getOne);
router.put('/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.COACH), (0, fileUploadHandler_1.default)(), controller.update);
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.COACH), controller.delete);
// Athlete check-in
router.put('/check-in/:id', (0, auth_1.default)(user_1.USER_ROLES.COACH, user_1.USER_ROLES.ATHLETE), controller.checkIn);
// Active / In-Active update on log in and log out.
router.put('/status', (0, auth_1.default)(user_1.USER_ROLES.ATHLETE), controller.updateStatus);
// get and update athlete profile...
router
    .route('/profile')
    .get((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.COACH), controller.getAthleteProfile)
    .patch((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.COACH), (0, fileUploadHandler_1.default)(), controller.updateProfile);
exports.AthleteRouter = router;
