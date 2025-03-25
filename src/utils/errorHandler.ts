// export class AppError extends Error {
//   statusCode: number;
//   constructor(statusCode: number, message: string) {
//     super(message);
//     this.statusCode = statusCode;
//   }
// }

// export function handleControllerError(error: AppError, res: any) {
//   const showStackTrace = error instanceof AppError || process.env.NODE_ENV !== 'production';
//   const message = showStackTrace ? error.message : 'Internal Server Error';
//   console.log('common error', error?.statusCode, {message});
//   res.status(error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
// }


