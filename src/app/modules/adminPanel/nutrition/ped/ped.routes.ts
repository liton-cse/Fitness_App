import express from 'express';
import { PEDInfoController } from './ped.controller';
import auth from '../../../../middlewares/auth';
import { USER_ROLES } from '../../../../../enums/user';

const router = express.Router();
const pedController = new PEDInfoController();

// Create PED info
router.post('/', auth(USER_ROLES.SUPER_ADMIN), pedController.addPEDInfo);

// Get all PED info (search + pagination)
router.get('/', pedController.getAllPEDInfo);

// Get single PED info by ID
router.get('/:id', pedController.getPEDInfoById);

// Update PED info by ID
router.patch(
  '/save',
  auth(USER_ROLES.SUPER_ADMIN),
  pedController.updatePEDInfo
);

// Delete PED info by ID
router.delete(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  pedController.deletePEDInfo
);

export const PEDInfoRoutes = router;
