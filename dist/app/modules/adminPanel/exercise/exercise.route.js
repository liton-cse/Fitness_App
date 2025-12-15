"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseRouter = void 0;
const express_1 = require("express");
const exercise_controller_1 = require("./exercise.controller");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const user_1 = require("../../../../enums/user");
const fileUploadHandler_1 = __importDefault(require("../../../middlewares/fileUploadHandler"));
const router = (0, express_1.Router)();
const controller = new exercise_controller_1.ExerciseController();
router.post('/', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploadHandler_1.default)(), controller.addExercise);
router.get('/', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ATHLETE), controller.getAllExercises);
router.get('/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), controller.getExerciseById);
router.put('/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploadHandler_1.default)(), controller.updateExercise);
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), controller.deleteExercise);
exports.ExerciseRouter = router;
