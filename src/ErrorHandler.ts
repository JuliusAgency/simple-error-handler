import { Response } from "express";

import { AppError, ResponseCode } from "./AppError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: Error, response?: Response) => {
  if (response) {
    if (error instanceof AppError) {
      appErrorHandler(error, response);
    } else {
      internalErrorHandler(error, response);
    };
  } else {
    criticalErrorHandler(error);
  };
};

const appErrorHandler = (error: AppError, response: Response) => {
  response.status(error.code).json({ message: error.message });
};

const internalErrorHandler = (error: Error, response: Response) => {
  console.log(`internalErrorHandler ${error.message}`);
  response.status(ResponseCode.INTERNAL_SERVER_ERROR).send('Internal server error');
};

const criticalErrorHandler = (error: Error) => {
  console.log(`criticalErrorHandler ${error.message}`);
  process.exit(1);
};

const isAppError = (error: Error): boolean => {
  return (error instanceof AppError);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
process.on('unhandledRejection', (error: Error) => {
  throw error;
});

process.on('uncaughtException', (error: Error) => {
  // just received an error that was never handled, 
  // time to handle it and then decide whether a restart is needed
  if (!isAppError(error)) {
    criticalErrorHandler(error);
  };
  errorHandler(error);
});
