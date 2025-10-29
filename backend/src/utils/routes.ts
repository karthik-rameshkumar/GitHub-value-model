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
 * Note: The pagination metadata is based on the current page's data length,
 * which is appropriate for APIs that don't provide total count (like GitHub's API).
 * The `total` field represents items in the current response, not all items.
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
 * Maps default error messages to 404-specific messages.
 */
const notFoundMessages: Record<string, string> = {
  'Failed to fetch pull request': 'Pull request not found',
  'Failed to calculate lead time': 'Pull request not found',
  'Failed to fetch repository': 'Repository not found',
  'Failed to sync repository': 'Repository not found',
  'Failed to fetch repository languages': 'Repository not found',
  'Failed to fetch repository stats': 'Repository not found',
};

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
  const errorMessage = statusCode === 404 && notFoundMessages[defaultMessage]
    ? notFoundMessages[defaultMessage]
    : defaultMessage;
  
  res.status(statusCode).json({
    success: false,
    error: errorMessage,
  });
}
