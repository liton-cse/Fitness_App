import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { DailyTrackingService } from './daily.tracking.service';

const dailyTrackingService = new DailyTrackingService();

export class DailyTrackingController {
  /**
   * Create daily tracking
   * POST /api/v1/daily-tracking
   */
  createDailyTracking = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      console.log('mohosin vai');
      console.log(req.body);
      const payload = {
        ...req.body,
        userId: req.user.id,
      };
      const result = await dailyTrackingService.createDailyTracking(payload);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Daily tracking created successfully',
        data: result,
      });
    }
  );

  /**
   * Get all daily tracking records
   * GET /api/v1/daily-tracking
   */
  getAllDailyTracking = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.userId;
      const result = await dailyTrackingService.getAllDailyTracking(userId);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Daily tracking fetched successfully',
        data: result,
      });
    }
  );

  /**
   * Get single daily tracking by ID
   * GET /api/v1/daily-tracking/:id
   */
  getSingleDailyTracking = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      const result = await dailyTrackingService.getDailyTrackingById(id);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Daily tracking fetched successfully',
        data: result,
      });
    }
  );

  /**
   * Update daily tracking by ID
   * PATCH /api/v1/daily-tracking/:id
   */
  updateDailyTracking = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      const result = await dailyTrackingService.updateDailyTracking(
        id,
        req.body
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Daily tracking updated successfully',
        data: result,
      });
    }
  );

  /**
   * Delete daily tracking by ID
   * DELETE /api/v1/daily-tracking/:id
   */
  deleteDailyTracking = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      const result = await dailyTrackingService.deleteDailyTracking(id);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Daily tracking deleted successfully',
        data: result,
      });
    }
  );
}
