"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowManagementRoutes = void 0;
const express_1 = __importDefault(require("express"));
const mangement_controller_1 = require("./mangement.controller");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const user_1 = require("../../../../enums/user");
const router = express_1.default.Router();
const showController = new mangement_controller_1.ShowManagementController();
// CRUD routes
router.post('/', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), showController.addShow);
router.get('/', showController.getAllShows);
router.get('/:id', showController.getShowById);
router.put('/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), showController.updateShow);
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), showController.deleteShow);
exports.ShowManagementRoutes = router;
