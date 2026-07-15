import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../lib/auth';
import type { ProductDocument } from '../types/product';

// GET /api/products - Public, list with filter/sort/pagination
export const getProducts = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const search = req.query.search as string;
    const sort = req.query.sort as string;
    const page = parseInt((req.query.page as string) || '1');
    const limit = parseInt((req.query.limit as string) || '8');

    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : NaN;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : NaN;

    const filter: Record<string, any> = {};
    if (category && category !== 'all') filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      filter.price = {};
      if (!isNaN(minPrice)) filter.price.$gte = minPrice;
      if (!isNaN(maxPrice)) filter.price.$lte = maxPrice;
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };

    const collection = db.collection<ProductDocument>('products');

    const total = await collection.countDocuments(filter);

    const rawProducts = await collection
      .find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const products = rawProducts.map(({ _id, ...rest }) => ({
      id: _id!.toString(),
      ...rest,
    }));

    res.json({ products, total, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// GET /api/products/:id - Public, single product
export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid product id' });
      return;
    }
    const product = await db
      .collection<ProductDocument>('products')
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const { _id, ...rest } = product;
    res.json({ id: _id!.toString(), ...rest });
  } catch {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// POST /api/products - Admin only
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, shortDescription, fullDescription, price, category, image } =
      req.body;

    if (
      !title ||
      !shortDescription ||
      !fullDescription ||
      !price ||
      !category
    ) {
      res.status(400).json({ error: 'Shob required field pooron koro' });
      return;
    }

    const newProduct: ProductDocument = {
      title,
      shortDescription,
      fullDescription,
      price: Number(price),
      category,
      image: image || '',
      rating: 0,
      createdAt: new Date(),
      addedBy: req.userId as string,
    };

    const result = await db
      .collection<ProductDocument>('products')
      .insertOne(newProduct);

    res.status(201).json({ message: 'Product added', id: result.insertedId });
  } catch {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// PUT /api/products/:id - Admin only 
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid product id' });
      return;
    }

    const { title, shortDescription, fullDescription, price, category, image } =
      req.body;

    if (
      !title ||
      !shortDescription ||
      !fullDescription ||
      !price ||
      !category
    ) {
      res.status(400).json({ error: 'Shob required field pooron koro' });
      return;
    }

    const result = await db.collection<ProductDocument>('products').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          shortDescription,
          fullDescription,
          price: Number(price),
          category,
          image: image || '',
        },
      },
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ message: 'Product updated successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// DELETE /api/products/:id - Admin only
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid product id' });
      return;
    }

    const result = await db
      .collection<ProductDocument>('products')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ message: 'Product deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const saveContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Shob field pooron koro' });
      return;
    }
    await db.collection('messages').insertOne({ name, email, message, createdAt: new Date() });
    res.status(201).json({ message: 'Message sent successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to send message' });
  }
};
export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email dite hobe' });
      return;
    }
    const existing = await db.collection('subscribers').findOne({ email });
    if (existing) {
      res.status(400).json({ error: 'Email already subscribed!' });
      return;
    }
    await db.collection('subscribers').insertOne({ email, createdAt: new Date() });
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch {
    res.status(500).json({ error: 'Subscription failed' });
  }
};