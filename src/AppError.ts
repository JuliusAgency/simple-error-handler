export enum ResponseCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export interface AppErrorArgs {
  name?: string;
  code: ResponseCode;
  description: string;
}

export class AppError extends Error {
  public readonly name: string;
  public readonly code: ResponseCode;

  constructor(args: AppErrorArgs) {
    super(args.description);
    // because we are extending a built-in class.
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name || 'Error';
    this.code = args.code;

    Error.captureStackTrace(this);
  }
}
