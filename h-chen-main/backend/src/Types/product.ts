export interface HeroBanner {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
}

export interface DailyRitual {
  title: string;
  description: string;
  lifestyleImage: string;
}

export interface IngredientHighlight {
  name: string;
  description: string;
  image: string;
}

export interface IngredientHighlight {
  name: string;
  description: string;
  image: string;
}

export interface Product {
  _id: string; // Mongoose adds _id
  sku: string;
  slug: string;
  title: string;
  images: string[];
  new: boolean;
  description: string;
  category: string; // Assuming category will be populated or just the ID string
  tags: string[];
  colors?: string[];
  sizes?: string[];
  brand: string;
  price: number;
  salePrice: number;
  discount?: number;
  ratings: number;
  reviews_number: number;
  bestBefore: string; // Will likely be a Date object from DB, but string for display initially
  createdAt: string;
  updatedAt: string;
  stock: number;
}

export const MAX_INGREDIENTS = 3;
