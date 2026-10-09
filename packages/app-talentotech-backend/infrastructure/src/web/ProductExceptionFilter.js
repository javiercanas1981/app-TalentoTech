import { Catch, HttpException, HttpStatus } from "@nestjs/common";
import { InsufficientStockError } from "../../../application/src/errors/InsufficientStockError.js";
import { ProductNotFoundError } from "../../../application/src/errors/ProductNotFoundError.js";
import { ProductValidationError } from "../../../application/src/errors/ProductValidationError.js";

export class ProductExceptionFilter {
  catch(exception, host) {
    const response = host.switchToHttp().getResponse();
    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    const isNotFound = exception instanceof ProductNotFoundError;
    const isStockConflict = exception instanceof InsufficientStockError;
    const isBadRequest =
      exception instanceof ProductValidationError ||
      exception instanceof TypeError;

    if (!isNotFound && !isStockConflict && !isBadRequest) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
      });
      return;
    }

    const statusCode = isNotFound
      ? HttpStatus.NOT_FOUND
      : isStockConflict
        ? HttpStatus.CONFLICT
        : HttpStatus.BAD_REQUEST;
    response.status(statusCode).json({
      statusCode,
      message: exception.message,
      error: isNotFound
        ? "Not Found"
        : isStockConflict
          ? "Conflict"
          : "Bad Request",
      ...(isStockConflict && {
        productId: exception.productId,
        requestedQuantity: exception.requestedQuantity,
        availableStock: exception.availableStock,
      }),
    });
  }
}

Catch()(ProductExceptionFilter);
