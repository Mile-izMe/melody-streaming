export class ApiError extends Error {
  status: number;
  detail: string;
  title: string;
  instance: string;

  constructor(data: {
    status: number;
    detail: string;
    title: string;
    instance: string;
  }) {
    super(data.detail); // message = detail
    this.name = "ApiError";
    this.status = data.status;
    this.detail = data.detail;
    this.title = data.title;
    this.instance = data.instance;
  }
}
