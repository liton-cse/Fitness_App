import express from 'express';
import { DailyTrackingController } from './track.meal.controller';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
const router = express.Router();
const controller = new DailyTrackingController();

/**
 * Daily Tracking Routes
 */
router.post('/', auth(USER_ROLES.ATHLETE), controller.createDailyTracking);
router.get('/', auth(USER_ROLES.ATHLETE), controller.getDailyTracking);
router.patch(
  '/:date/:id',
  auth(USER_ROLES.ATHLETE),
  controller.updateTrackMeal
);
router.delete(
  '/:date/:mealId',
  auth(USER_ROLES.ATHLETE),
  controller.deleteTrackMeal
);

export const DailyTrackingMealRoutes = router;
