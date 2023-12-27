import 'express-async-errors';
import { NextFunction, Request, Response } from 'express';

import { AppError, ResponseCode } from './AppError';

export const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const appErrorHandler = (error: AppError, response: Response) => {
    console.log(`appErrorHandler ${error.name}, ${error.message}`);
    response.status(error.code).json({ message: error.message });
  };

  const internalErrorHandler = (error: Error, response: Response) => {
    console.log(`internalErrorHandler ${error.message}`);
    response
      .status(ResponseCode.INTERNAL_SERVER_ERROR)
      .send('Internal server error');
  };

  const criticalErrorHandler = (error: Error) => {
    console.log(`criticalErrorHandler ${error.message}`);
    process.exit(1);
  };

  if (response) {
    if (error instanceof AppError) {
      appErrorHandler(error, response);
    } else {
      internalErrorHandler(error, response);
    }
  } else {
    criticalErrorHandler(error);
  }
};
