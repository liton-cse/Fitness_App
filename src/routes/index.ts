import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { AthleteRouter } from '../app/modules/adminPanel/athlete/athleteRoute';
import { CoachRouter } from '../app/modules/adminPanel/coach/coachroute';
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
    path: '/coach',
    route: CoachRouter,
  },
  {
    path: '/athlete',
    route: AthleteRouter,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
