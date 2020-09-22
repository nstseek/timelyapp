/** Defines the default API response with a dynamic data type. */
export interface HttpResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

/** Defines the default API interface used to send sizes inside images. */
interface ImageSize {
  width: number;
  url: string;
  height: number;
}

/** Defines the default API interface used to send images. */
export interface Image {
  sizes: {
    small?: ImageSize;
    thumbnail?: ImageSize;
    medium?: ImageSize;
    full?: ImageSize;
  };
  id: number;
  title: string;
}
