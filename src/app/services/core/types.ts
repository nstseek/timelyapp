export interface HttpResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

interface ImageSize {
  width: number;
  url: string;
  height: number;
}

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
