import { NextFunction, Request, Response } from 'express';

export function dbTransactionMiddleware(
  req: Request<any>,
  res: Response,
  next: NextFunction,
) {
  (req as any).tx = 'hello world';
}
