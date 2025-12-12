import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SupplementItemService } from './supplement.service';
import catchAsync from '../../../../../shared/catchAsync';
import sendResponse from '../../../../../shared/sendResponse';

const supplementService = new SupplementItemService();

export class SupplementItemController {
  /**
   * Add new supplement
   * POST /api/v1/supplements
   */
  addSupplement = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await supplementService.createSupplement(req.body);
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Supplement created successfully',
        data: result,
      });
    }
  );

  /**
   * Get all supplements with optional search and pagination
   * GET /api/v1/supplements?search=&page=&limit=
   */
  getAllSupplements = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { search, page, limit } = req.query;
      const result = await supplementService.getAllSupplements(
        search as string,
        Number(page) || 1,
        Number(limit) || 10
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Supplements retrieved successfully',
        data: result,
      });
    }
  );

  /**
   * Get supplement by ID
   * GET /api/v1/supplements/:id
   */
  getSupplementById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await supplementService.getSupplementById(req.params.id);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Supplement retrieved successfully',
        data: result,
      });
    }
  );

  /**
   * Update supplement by ID
   * PATCH /api/v1/supplements/:id
   */
  updateSupplement = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await supplementService.updateSupplement(
        req.params.id,
        req.body
      );

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Supplement updated successfully',
        data: result,
      });
    }
  );

  /**
   * Delete supplement by ID
   * DELETE /api/v1/supplements/:id
   */
  deleteSupplement = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await supplementService.deleteSupplement(req.params.id);

      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Supplement deleted successfully',
        data: result,
      });
    }
  );
}
