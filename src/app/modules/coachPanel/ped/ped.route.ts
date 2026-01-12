import express from 'express';
import { PEDDatabaseController } from './ped.controller';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';

const router = express.Router();
const controller = new PEDDatabaseController();

/**
 * 👨‍🏫 Coach Routes
 */

// Create weekly PED template
router.post('/', auth(USER_ROLES.COACH), controller.createWeeklyPEDDatabase);

// Get PED for a specific athlete (coach view)
router.get('/:athleteId', auth(USER_ROLES.COACH), controller.getAthletePED);

// Update PED for a specific athlete (coach)
router.patch(
  '/:athleteId',
  auth(USER_ROLES.COACH),
  controller.updateAthletePED
);


/**
 * 👨‍💻 Athlete Routes
 */

// Get all PEDs for logged-in athlete (with optional week filter)
router.get('/app-data', controller.getPEDForAthleteInApp);
router.get('/', auth(USER_ROLES.COACH), controller.getPEDByAthlete);

// Optional: Get PED by week via query param
// e.g., GET /ped?week=week_1
router.get('/week/:week', auth(USER_ROLES.ATHLETE), controller.getPEDByWeek);

export const PEDDatabaseRouter = router;
