import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CoachService } from './coachService';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';

const userService = new CoachService();

export class CoachController {
  createUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await userService.createUser(req.body);
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Coach created successfully',
        data: result,
      });
    }
  );

  getUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await userService.getUsers();

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Coaches fetched successfully',
        data: result,
      });
    }
  );

  getUserById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await userService.getUserById(req.params.id);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Coach fetched successfully',
        data: result,
      });
    }
  );

  updateUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await userService.updateUser(req.params.id, req.body);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Coach updated successfully',
        data: result,
      });
    }
  );

  deleteUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      await userService.deleteUser(req.params.id);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Coach deleted successfully',
        data: null,
      });
    }
  );
}
