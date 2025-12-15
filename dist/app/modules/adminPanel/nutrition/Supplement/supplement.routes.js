"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplementItemRoute = void 0;
const express_1 = __importDefault(require("express"));
const supplement_controller_1 = require("./supplement.controller");
const auth_1 = __importDefault(require("../../../../middlewares/auth"));
const user_1 = require("../../../../../enums/user");
const router = express_1.default.Router();
const supplementController = new supplement_controller_1.SupplementItemController();
// Public routes
router.get('/', supplementController.getAllSupplements);
router.get('/:id', supplementController.getSupplementById);
// Protected routes (Admin or Coach)
router.post('/', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), supplementController.addSupplement);
router.put('/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), supplementController.updateSupplement);
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), supplementController.deleteSupplement);
exports.SupplementItemRoute = router;
