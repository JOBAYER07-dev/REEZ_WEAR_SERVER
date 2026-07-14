import { Request, Response } from 'express';
import { ObjectId } from 'mongodb'; // 🎯 ObjectId ইম্পোর্ট নিশ্চিত করা হলো
import { db } from '../lib/auth';
import { auth } from '../lib/auth';
import { fromNodeHeaders } from 'better-auth/node';

// ১. POST /api/orders - কাস্টমারের জন্য অর্ডার প্লেস করা
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      name,
      phone,
      address,
      paymentMethod,
      items,
      subtotal,
      deliveryCharge,
      totalAmount,
    } = req.body;

    if (!name || !phone || !address || !items || items.length === 0) {
      res.status(400).json({ error: 'Shob required field pooron koro' });
      return;
    }

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    const newOrder = {
      name,
      phone,
      address,
      paymentMethod,
      items,
      subtotal,
      deliveryCharge,
      totalAmount,
      status: 'pending',
      userId: session?.user?.id || null,
      createdAt: new Date(),
    };

    const result = await db.collection('orders').insertOne(newOrder);

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: result.insertedId,
    });
  } catch (error) {
    console.error('Order placement failed:', error);
    res.status(500).json({ error: 'Failed to place order. Abar try koro' });
  }
};

// ২. GET /api/orders - শুধুমাত্র অ্যাডমিন সব অর্ডার দেখতে পারবে
export const getOrders = async (req: Request, res: Response) => {
  try {
    const collection = db.collection('orders');
    const rawOrders = await collection.find().sort({ createdAt: -1 }).toArray();

    const orders = rawOrders.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));

    res.json({ orders });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// ৩. PUT /api/orders/:id/status - শুধুমাত্র অ্যাডমিন অর্ডার আপডেট করতে পারবে
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid order id' });
      return;
    }

    if (!status) {
      res.status(400).json({ error: 'Status provide korte hobe' });
      return;
    }

    const result = await db
      .collection('orders')
      .updateOne({ _id: new ObjectId(id) }, { $set: { status } });

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Order khuje paowa jayni' });
      return;
    }

    res.json({ message: `Order status updated successfully to ${status}` });
  } catch (error) {
    console.error('Failed to update order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};
