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
router.get('/', controller.getPEDByAthlete);
router.get('/:week', controller.getPEDByWeek);

export const PEDDatabaseRouter = router;
