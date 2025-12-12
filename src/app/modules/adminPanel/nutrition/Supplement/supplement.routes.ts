import express from 'express';
import { SupplementItemController } from './supplement.controller';
import auth from '../../../../middlewares/auth';
import { USER_ROLES } from '../../../../../enums/user';

const router = express.Router();
const supplementController = new SupplementItemController();

// Public routes
router.get('/', supplementController.getAllSupplements);
router.get('/:id', supplementController.getSupplementById);

// Protected routes (Admin or Coach)
router.post(
  '/',
  auth(USER_ROLES.SUPER_ADMIN),
  supplementController.addSupplement
);
router.put(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  supplementController.updateSupplement
);
router.delete(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  supplementController.deleteSupplement
);

export const SupplementItemRoute = router;
