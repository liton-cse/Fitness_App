import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { CheckInService } from './checkin.service';
import { Types } from 'mongoose';
import { getMultipleFilesPath } from '../../../../shared/getFilePath';

const checkInService = new CheckInService();

export class CheckInController {
  /**
   * Create a new Check-in
   * POST /api/v1/checkin
   */
  createCheckIn = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const images = getMultipleFilesPath(req.files, 'image');
      const videos = getMultipleFilesPath(req.files, 'video');
      const payload = {
        ...req.body,
        userId: req.user.id,
        image: images,
        video: videos,
      };
      const result = await checkInService.createCheckIn(payload);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Check-in created successfully',
        data: result,
      });
    }
  );

  /**
   * Get all Check-ins for logged-in user
   * GET /api/v1/checkin
   */
  getAllCheckIns = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 1;

      const result = await checkInService.getCheckInsByUser(
        req.user.id,
        page,
        limit
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Fetched all check-ins successfully',
        data: result,
      });
    }
  );

  /**
   * Returns next check-in date based on athlete's check-in day
   */
  getNextCheckInDate = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;

    const result = await checkInService.getNextCheckInInfo(userId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Next check-in date calculated successfully',
      data: result,
    });
  });

  /**
   * Get a single Check-in by ID
   * GET /api/v1/checkin/:id
   */
  getCheckInById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Convert string ID to ObjectId
      const id: Types.ObjectId = new Types.ObjectId(req.params.id);

      const result = await checkInService.getCheckInById(id);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Fetched check-in successfully',
        data: result,
      });
    }
  );

  /**
   * Update a Check-in by ID
   * PATCH /api/v1/checkin/:id
   */
  updateCheckIn = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id: Types.ObjectId = new Types.ObjectId(req.params.id);
      const result = await checkInService.updateCheckIn(id, req.body);
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Check-in updated successfully',
        data: result,
      });
    }
  );

  /**
   * Delete a Check-in by ID
   * DELETE /api/v1/checkin/:id
   */
  deleteCheckIn = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id: Types.ObjectId = new Types.ObjectId(req.params.id);
      const result = await checkInService.deleteCheckIn(id);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Check-in deleted successfully',
        data: result,
      });
    }
  );
}
