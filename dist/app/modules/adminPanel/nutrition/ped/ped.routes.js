"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PEDInfoRoutes = void 0;
const express_1 = __importDefault(require("express"));
const ped_controller_1 = require("./ped.controller");
const auth_1 = __importDefault(require("../../../../middlewares/auth"));
const user_1 = require("../../../../../enums/user");
const router = express_1.default.Router();
const pedController = new ped_controller_1.PEDInfoController();
// Create PED info
router.post('/', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), pedController.addPEDInfo);
// Get all PED info (search + pagination)
router.get('/', pedController.getAllPEDInfo);
// Get single PED info by ID
router.get('/:id', pedController.getPEDInfoById);
// Update PED info by ID
router.patch('/save', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), pedController.updatePEDInfo);
// Delete PED info by ID
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), pedController.deletePEDInfo);
exports.PEDInfoRoutes = router;
