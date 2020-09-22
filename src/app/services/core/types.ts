export interface HttpResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}
