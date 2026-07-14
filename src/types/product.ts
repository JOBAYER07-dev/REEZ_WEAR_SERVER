import type { ObjectId } from 'mongodb';

export interface ProductDocument {
  _id?: ObjectId;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  createdAt: Date;
  addedBy: string;
}
