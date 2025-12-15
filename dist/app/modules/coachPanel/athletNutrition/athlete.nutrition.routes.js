"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoachNutritionRouter = void 0;
const express_1 = require("express");
const athlete_nutrition_controller_1 = require("./athlete.nutrition.controller");
const user_1 = require("../../../../enums/user");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const router = (0, express_1.Router)();
const controller = new athlete_nutrition_controller_1.AthleteNutritionPlanController();
// CRUD routes
router.post('/:id', (0, auth_1.default)(user_1.USER_ROLES.COACH), controller.addNutritionPlan);
router.get('/:id', (0, auth_1.default)(user_1.USER_ROLES.COACH, user_1.USER_ROLES.ATHLETE), controller.getNutritionPlans); // with filter/search
router.get('/one/:id', controller.getNutritionPlanById);
router.patch('/:id', controller.updateNutritionPlan);
router.delete('/:id', controller.deleteNutritionPlan);
exports.CoachNutritionRouter = router;
