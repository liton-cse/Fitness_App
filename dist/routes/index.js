"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../app/modules/auth/auth.route");
const user_route_1 = require("../app/modules/user/user.route");
const athleteRoute_1 = require("../app/modules/adminPanel/athlete/athleteRoute");
const coachroute_1 = require("../app/modules/adminPanel/coach/coachroute");
const coachAuthRoute_1 = require("../app/modules/adminPanel/coach/coachAuthRoute");
const exercise_route_1 = require("../app/modules/adminPanel/exercise/exercise.route");
const athleteAuthRoute_1 = require("../app/modules/adminPanel/athlete/athleteAuthRoute");
const food_routes_1 = require("../app/modules/adminPanel/nutrition/Food/food.routes");
const supplement_routes_1 = require("../app/modules/adminPanel/nutrition/Supplement/supplement.routes");
const ped_routes_1 = require("../app/modules/adminPanel/nutrition/ped/ped.routes");
const management_route_1 = require("../app/modules/coachPanel/showManagement/management.route");
const daily_tracking_routes_1 = require("../app/modules/appAthlete/dailyTracking/daily.tracking.routes");
const checkin_routes_1 = require("../app/modules/appAthlete/checkIn/checkin.routes");
const athlete_nutrition_routes_1 = require("../app/modules/coachPanel/athletNutrition/athlete.nutrition.routes");
const router = express_1.default.Router();
const apiRoutes = [
    {
        path: '/user',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/auth/coach',
        route: coachAuthRoute_1.CoachAuthRoutes,
    },
    {
        path: '/coach',
        route: coachroute_1.coachRoutes,
    },
    {
        path: '/auth/athlete',
        route: athleteAuthRoute_1.AthleteAuthRoutes,
    },
    {
        path: '/athlete',
        route: athleteRoute_1.AthleteRouter,
    },
    {
        path: '/exercise',
        route: exercise_route_1.ExerciseRouter,
    },
    {
        path: '/food/nutrition',
        route: food_routes_1.FoodItemRoutes,
    },
    {
        path: '/supplement/nutrition',
        route: supplement_routes_1.SupplementItemRoute,
    },
    {
        path: '/ped/nutrition',
        route: ped_routes_1.PEDInfoRoutes,
    },
    {
        path: '/show/management',
        route: management_route_1.ShowManagementRoutes,
    },
    {
        path: '/daily/tracking',
        route: daily_tracking_routes_1.DailyTrackingRoutes,
    },
    {
        path: '/check-in',
        route: checkin_routes_1.CheckInRoter,
    },
    {
        path: '/coach/nutrition',
        route: athlete_nutrition_routes_1.CoachNutritionRouter,
    },
];
apiRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
