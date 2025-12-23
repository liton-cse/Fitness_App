import { Request, Response } from 'express';
import { buildTimelineHistory } from './timeline.service';

export const getAthleteTimelineController = async (
  req: Request,
  res: Response
) => {
  try {
    const athleteId = req.params.athleteId;
    console.log(athleteId);
    const data = await buildTimelineHistory(athleteId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
