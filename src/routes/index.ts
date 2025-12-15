import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { AthleteRouter } from '../app/modules/adminPanel/athlete/athleteRoute';
import { coachRoutes } from '../app/modules/adminPanel/coach/coachroute';
import { CoachAuthRoutes } from '../app/modules/adminPanel/coach/coachAuthRoute';
import { ExerciseRouter } from '../app/modules/adminPanel/exercise/exercise.route';
import { AthleteAuthRoutes } from '../app/modules/adminPanel/athlete/athleteAuthRoute';
import { FoodItemRoutes } from '../app/modules/adminPanel/nutrition/Food/food.routes';
import { SupplementItemRoute } from '../app/modules/adminPanel/nutrition/Supplement/supplement.routes';
import { PEDInfoRoutes } from '../app/modules/adminPanel/nutrition/ped/ped.routes';
import { ShowManagementRoutes } from '../app/modules/coachPanel/showManagement/management.route';
import { DailyTrackingRoutes } from '../app/modules/appAthlete/dailyTracking/daily.tracking.routes';
import { CheckInRoter } from '../app/modules/appAthlete/checkIn/checkin.routes';
import { CoachNutritionRouter } from '../app/modules/coachPanel/athletNutrition/athlete.nutrition.routes';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/auth/coach',
    route: CoachAuthRoutes,
  },
  {
    path: '/coach',
    route: coachRoutes,
  },
  {
    path: '/auth/athlete',
    route: AthleteAuthRoutes,
  },
  {
    path: '/athlete',
    route: AthleteRouter,
  },
  {
    path: '/exercise',
    route: ExerciseRouter,
  },
  {
    path: '/food/nutrition',
    route: FoodItemRoutes,
  },
  {
    path: '/supplement/nutrition',
    route: SupplementItemRoute,
  },
  {
    path: '/ped/nutrition',
    route: PEDInfoRoutes,
  },
  {
    path: '/show/management',
    route: ShowManagementRoutes,
  },
  {
    path: '/daily/tracking',
    route: DailyTrackingRoutes,
  },
  {
    path: '/check-in',
    route: CheckInRoter,
  },
  {
    path: '/coach/nutrition',
    route: CoachNutritionRouter,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
