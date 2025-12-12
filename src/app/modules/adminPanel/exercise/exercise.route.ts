import { Router } from 'express';
import { ExerciseController } from './exercise.controller';
import auth from '../../../middlewares/auth';
import { USER_ROLES } from '../../../../enums/user';
import fileUploadHandler from '../../../middlewares/fileUploadHandler';

const router = Router();
const controller = new ExerciseController();

router.post(
  '/',
  auth(USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  controller.addExercise
);
router.get(
  '/',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ATHLETE),
  controller.getAllExercises
);
router.get('/:id', auth(USER_ROLES.SUPER_ADMIN), controller.getExerciseById);
router.put(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  controller.updateExercise
);
router.delete('/:id', auth(USER_ROLES.SUPER_ADMIN), controller.deleteExercise);

export const ExerciseRouter = router;
