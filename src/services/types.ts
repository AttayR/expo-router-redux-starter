/** Response shapes for the DummyJSON demo API (https://dummyjson.com/docs). */

export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = User & {
  accessToken: string;
  refreshToken: string;
};

export type ProductSummary = {
  id: number;
  title: string;
  price: number;
  rating: number;
  thumbnail: string;
  brand?: string;
  category: string;
};

export type Product = ProductSummary & {
  description: string;
  stock: number;
  images: string[];
};

export type ProductPage = {
  products: ProductSummary[];
  total: number;
  skip: number;
  limit: number;
};
