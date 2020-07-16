import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response, Request } from 'express';
import { BaseException} from '../exceptions/base.exception';

@Catch(BaseException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response
    .status(exception.status)
      .json({
        statusCode: exception.status,
        timestamp: new Date(),
        path: request.url,
        method: request.method,
        error: exception.message
      });
  }
}