import { NextFunction, Request, Response } from 'express';

export class ConflictError extends Error {}
export class NotFoundError extends Error {}
export class InvalidInputError extends Error {}
export class ForbiddenError extends Error {}
export class UnauthorizedError extends Error {}

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ConflictError) {
    res.status(409).json({
      message: err.message,
    });
  }

  if (err instanceof InvalidInputError) {
    res.status(400).json({
      message: err.message,
    });
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({
      message: err.message,
    });
  }

  if (err instanceof ForbiddenError) {
    res.status(403).json({
      message: err.message,
    });
  }

  if (err instanceof UnauthorizedError) {
    res.status(401).json({
      message: err.message,
    });
  }

  if (err instanceof Error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,
    });
  }

  next();
};
