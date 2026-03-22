export type Product = {
  id: number;
  name: string;
  alt: string;
  banner: string;
  images: string[];
  price: string;
  filter: string;
  mouseover: string;
  mouseout: string;
  cartpic: string;
  options: string[];
};

export type NewsItem = {
  title?: string;
  description?: string;
  image_url?: string;
  link?: string;
};
