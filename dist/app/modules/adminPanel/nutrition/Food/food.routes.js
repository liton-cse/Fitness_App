"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodItemRoutes = void 0;
const express_1 = __importDefault(require("express"));
const food_controller_1 = require("./food.controller");
const auth_1 = __importDefault(require("../../../../middlewares/auth"));
const user_1 = require("../../../../../enums/user");
const router = express_1.default.Router();
const foodController = new food_controller_1.FoodItemController();
// Public routes
router.get('/', foodController.getAllFoodItems);
router.get('/:id', foodController.getFoodItemById);
// Protected routes (Admin or Coach)
router.post('/', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), foodController.addFoodItem);
router.put('/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), foodController.updateFoodItem);
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), foodController.deleteFoodItem);
exports.FoodItemRoutes = router;
