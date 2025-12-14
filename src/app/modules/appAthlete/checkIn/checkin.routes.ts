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
  auth(USER_ROLES.ATHLETE),
  fileUploadHandler(),
  controller.createCheckIn
);

// Get all Check-ins for the logged-in user
router.get(
  '/',
  auth(USER_ROLES.ATHLETE, USER_ROLES.SUPER_ADMIN),
  controller.getAllCheckIns
);

// Get a single Check-in by ID
router.get('/:id', controller.getCheckInById);

// Update a Check-in by ID
router.patch('/:id', auth(USER_ROLES.SUPER_ADMIN), controller.updateCheckIn);

// Delete a Check-in by ID
router.delete('/:id', auth(USER_ROLES.SUPER_ADMIN), controller.deleteCheckIn);

export const CheckInRoter = router;
