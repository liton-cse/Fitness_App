import express from 'express';
import { DailyTrackingController } from './daily.tracking.controller';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';

const router = express.Router();
const controller = new DailyTrackingController();

/**
 * Daily Tracking Routes
 */

router.post('/', auth(USER_ROLES.ATHLETE), controller.createDailyTracking);
router.get(
  '/:userId',
  auth(USER_ROLES.ATHLETE, USER_ROLES.COACH),
  controller.getAllDailyTracking
);

router.get('/:id', controller.getSingleDailyTracking);

router.put(
  '/:id',

  auth(USER_ROLES.COACH, USER_ROLES.ATHLETE),
  controller.updateDailyTracking
);

router.delete(
  '/:id',
  auth(USER_ROLES.COACH, USER_ROLES.SUPER_ADMIN),
  controller.deleteDailyTracking
);

export const DailyTrackingRoutes = router;
