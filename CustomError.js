export default class CustomError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.status = statusCode;
    this.errorCode = errorCode;
  }
}
