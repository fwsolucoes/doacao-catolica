import { errorHandler } from "@arkyn/server";

class ErrorHandlerAdapter {
  static handle(error: any) {
    return errorHandler(error);
  }

  static async handleAsData(error: any) {
    const response = errorHandler(error);
    return response.json();
  }
}

export { ErrorHandlerAdapter };
