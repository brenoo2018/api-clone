export class HttpException extends Error {
  constructor(public message: string, public status: number) {
    super();
    this.message = message;
    this.status = status;
  }
}
