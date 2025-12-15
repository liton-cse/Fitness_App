import { Router } from 'express';
import { AthleteNutritionPlanController } from './athlete.nutrition.controller';
import { USER_ROLES } from '../../../../enums/user';
import auth from '../../../middlewares/auth';

const router = Router();
const controller = new AthleteNutritionPlanController();

// CRUD routes
router.post('/:id', auth(USER_ROLES.COACH), controller.addNutritionPlan);
router.get(
  '/:id',
  auth(USER_ROLES.COACH, USER_ROLES.ATHLETE),
  controller.getNutritionPlans
); // with filter/search

router.get('/one/:id', controller.getNutritionPlanById);
router.patch('/:id', controller.updateNutritionPlan);
router.delete('/:id', controller.deleteNutritionPlan);

export const CoachNutritionRouter = router;
