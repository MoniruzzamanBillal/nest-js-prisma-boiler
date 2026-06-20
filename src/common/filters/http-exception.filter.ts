import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errorName = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as Record<string, unknown>;
      message = (res.message as string) || exception.message;
      errorName = (res.error as string) || exception.name;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = exception;
      switch (prismaError.code) {
        case 'P2002': {
          let target = 'field';
          if (prismaError.meta?.target) {
            target = Array.isArray(prismaError.meta.target)
              ? prismaError.meta.target.join(', ')
              : (prismaError.meta.target as string);
          } else if (prismaError.meta?.constraint) {
            const constraint = prismaError.meta.constraint as string;
            if (constraint.includes('email')) target = 'email';
            if (constraint.includes('phone')) target = 'phone';
          }
          status = HttpStatus.CONFLICT;
          message = `This ${target} already exists. Please use a different one.`;
          errorName = 'ConflictError';
          break;
        }
        case 'P2003': {
          status = HttpStatus.BAD_REQUEST;
          message = 'Related record not found.';
          errorName = 'ReferenceError';
          break;
        }
        case 'P2025': {
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found in database.';
          errorName = 'NotFoundError';
          break;
        }
        default: {
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = `Database Error: ${prismaError.code}`;
          errorName = 'DatabaseError';
          break;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorName = exception.name;
    }

    this.logger.error(
      `[${request.method}] ${request.url} - Error: ${JSON.stringify(exception)}`,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      path: request.url,
      error: errorName,
      message:
        process.env.NODE_ENV === 'production' &&
        status === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'An unexpected error occurred'
          : Array.isArray(message)
            ? message.join(', ')
            : message,
      timestamp: new Date().toISOString(),
    });
  }
}
