import { Router } from 'express';
import { CoachController } from './coachController';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
import fileUploadHandler from '../../../middlewares/fileUploadHandler';

const router = Router();
const controller = new CoachController();

router.post(
  '/',
  auth(USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  controller.createUser
);
router.get(
  '/',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.COACH),
  controller.getUsers
);
router.get(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.COACH),
  controller.getUserById
);
router.put(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.COACH),
  fileUploadHandler(),
  controller.updateUser
);
router.delete('/:id', auth(USER_ROLES.SUPER_ADMIN), controller.deleteUser);

export const CoachRouter = router;
