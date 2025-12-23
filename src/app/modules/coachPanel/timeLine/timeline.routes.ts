import { Router } from 'express';
import { getAthleteTimelineController } from './timeline.controller';

const router = Router();

router.get('/:athleteId', getAthleteTimelineController);

export const TimeLineRouter = router;
