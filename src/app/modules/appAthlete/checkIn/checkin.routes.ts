import { Router } from 'express';
import { CheckInController } from './checkin.controller';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
import fileUploadHandler from '../../../middlewares/fileUploadHandler';

const router = Router();
const controller = new CheckInController();

// Create a new Check-in
router.post(
  '/',
  auth(USER_ROLES.ATHLETE, USER_ROLES.COACH),
  fileUploadHandler(),
  controller.createCheckIn
);

// Get all Check-ins for the logged-in user
router.get(
  '/',
  auth(USER_ROLES.ATHLETE, USER_ROLES.SUPER_ADMIN, USER_ROLES.COACH),
  controller.getAllCheckIns
);
router.get(
  '/date',
  auth(USER_ROLES.ATHLETE, USER_ROLES.SUPER_ADMIN),
  controller.getNextCheckInDate
);

router.get('/old-data', auth(USER_ROLES.ATHLETE), controller.getOldCheckInData);

// Get a single Check-in by ID
router.get('/:id', controller.getCheckInById);

// Update a Check-in by ID
router.patch('/:id', auth(USER_ROLES.COACH), controller.updateCheckIn);
//update the check in status
router.patch(
  '/status/:athleteId',
  auth(USER_ROLES.COACH),
  controller.UpdateCheckInStatus
);

// Delete a Check-in by ID
router.delete('/:id', auth(USER_ROLES.SUPER_ADMIN), controller.deleteCheckIn);

export const CheckInRoter = router;
