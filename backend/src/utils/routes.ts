import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

/**
 * Sends a standardized success response.
 */
export function sendSuccessResponse<T>(
  res: Response,
  data: T,
  message?: string
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };
  res.json(response);
}

/**
 * Sends a standardized paginated response.
 */
export function sendPaginatedResponse<T>(
  res: Response,
  data: T[],
  page: number,
  limit: number
): void {
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total: data.length,
      pages: Math.ceil(data.length / limit),
      hasNext: data.length === limit,
      hasPrev: page > 1,
    },
  };
  res.json(response);
}

/**
 * Sends a standardized error response with appropriate status code.
 */
export function sendErrorResponse(
  res: Response,
  error: any,
  defaultMessage: string
): void {
  console.error(`${defaultMessage}:`, error);
  const statusCode = error.status === 404 ? 404 : 500;
  const errorMessage = statusCode === 404 
    ? `${defaultMessage.replace('Failed to', 'Not found:').replace('fetch', '').replace('calculate', '')}`
    : defaultMessage;
  
  res.status(statusCode).json({
    success: false,
    error: errorMessage,
  });
}
