export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: Error): { status: number; message: string } {
  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      message: error.message,
    };
  }

  // Log error for debugging
  console.error('Unexpected error:', error);

  return {
    status: 500,
    message: 'Internal Server Error',
  };
}
