import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../../../shared/catchAsync';
import sendResponse from '../../../../../shared/sendResponse';
import { PEDInfoService } from './ped.service';

const pedService = new PEDInfoService();

export class PEDInfoController {
  /**
   * Add new PED info
   * POST /api/v1/ped-info
   */
  addPEDInfo = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await pedService.createPEDInfo(req.body);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'PED info created successfully',
        data: result,
      });
    }
  );

  /**
   * Get all PED info (search + pagination)
   * GET /api/v1/ped-info
   */
  getAllPEDInfo = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { search = '', page = 1, limit = 10 } = req.query;

      const result = await pedService.getAllPEDInfo(
        search as string,
        Number(page),
        Number(limit)
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'PED info fetched successfully',
        data: result,
      });
    }
  );

  /**
   * Get single PED info
   * GET /api/v1/ped-info/:id
   */
  getPEDInfoById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await pedService.getPEDInfoById(req.params.id);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'PED info fetched successfully',
        data: result,
      });
    }
  );

  /**
   * Update PED info
   * PATCH /api/v1/ped-info/:id
   */
  updatePEDInfo = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await pedService.updatePEDInfo(req.body);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'PED info updated successfully',
        data: result,
      });
    }
  );

  /**
   * Delete PED info
   * DELETE /api/v1/ped-info/:id
   */
  deletePEDInfo = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await pedService.deletePEDInfo(req.params.id);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'PED info deleted successfully',
        data: result,
      });
    }
  );
}
