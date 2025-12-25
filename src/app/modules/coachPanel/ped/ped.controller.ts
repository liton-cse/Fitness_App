import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { PEDDatabaseService } from './ped.service';

const pedService = new PEDDatabaseService();

export class PEDDatabaseController {
  /**
   * Create weekly PED database
   * Automatically generates:
   * - week (Week 1, Week 2, ...)
   * - subCategory id
   * - empty dosage / frequency / days
   *
   * POST /api/v1/ped/:athleteId
   */
  createWeeklyPEDDatabase = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // assuming coachId is attached by auth middleware
      const coachId = (req as any).user?.id;

      const { category, subCategory } = req.body;

      const result = await pedService.createWeeklyPEDDatabase({
        coachId,
        category,
        subCategory,
      });

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Weekly PED database created successfully',
        data: result,
      });
    }
  );

  /**
   * Get all PED records for an athlete
   * GET /api/v1/ped/:athleteId
   */
  getPEDByAthlete = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const coachId = req.user.id;
      console.log(coachId);
      const result = await pedService.getAllPED(coachId);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'PED database fetched successfully',
        data: result,
      });
    }
  );

  /**
   * Get single week PED data
   * GET /api/v1/ped/:athleteId/:week
   * Example: /ped/123/Week 2
   */
  getPEDByWeek = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { week } = req.params;
      const coachId = req.user.id;
      const result = await pedService.getPEDByWeek(coachId, week);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Weekly PED data fetched successfully',
        data: result,
      });
    }
  );
}
