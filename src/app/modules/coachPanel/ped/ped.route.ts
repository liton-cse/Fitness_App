import express from 'express';
import { PEDDatabaseController } from './ped.controller';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';

const router = express.Router();
const controller = new PEDDatabaseController();

/**
 * PED Database Routes
 */
router.post('/', auth(USER_ROLES.COACH), controller.createWeeklyPEDDatabase);
/**
 * 👨‍🏫 Coach
 */
router.get(
  "/:athleteId",
  auth(USER_ROLES.COACH),
  controller.getAthletePED
);
router.get('/', controller.getPEDByAthlete);
router.get('/:week', controller.getPEDByWeek);

/**
 * 👨‍🏫 Coach
 */
router.get(
  "/:athleteId",
  auth(USER_ROLES.COACH),
  controller.getAthletePED
);

router.patch(
  "/:athleteId",
  auth(USER_ROLES.COACH),
  controller.updateAthletePED
);

export const PEDDatabaseRouter = router;
