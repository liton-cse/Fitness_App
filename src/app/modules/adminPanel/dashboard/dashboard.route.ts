import { Router } from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
import { DashboardController } from './dashboard.controller';

const router = Router();
const controller = new DashboardController();

router.get(
  '/admin',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.COACH),
  controller.dashboardInfo
);

export const DashboardRouter = router;
