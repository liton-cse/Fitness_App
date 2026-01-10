import express from 'express';
import { TrainingPushDayHistoryController } from './trainigplan.history.controller';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';

const router = express.Router();
const controller = new TrainingPushDayHistoryController();

/**
 * Add Training Push Day History
 */
router.post(
  '/',
  auth(USER_ROLES.ATHLETE, USER_ROLES.COACH),
  controller.addTrainingPushDayHistory
);

/**
 * Get Training Push Day History
 */
router.get(
  '/',
  auth(USER_ROLES.ATHLETE, USER_ROLES.COACH),
  controller.getTrainingPushDayHistory
);

/**
 * Update Training Push Day History
 */
router.patch(
  '/:id',
  auth(USER_ROLES.ATHLETE, USER_ROLES.COACH),
  controller.updateTrainingPushDayHistory
);

/**
 * Delete Training Push Day History
 */
router.delete(
  '/:id',
  auth(USER_ROLES.ATHLETE, USER_ROLES.COACH),
  controller.deleteTrainingPushDayHistory
);

export const TrainingPushDayHistoryRoutes = router;
