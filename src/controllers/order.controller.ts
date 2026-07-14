import { Request, Response } from 'express';
import { db } from '../lib/auth';
import { auth } from '../lib/auth';
import { fromNodeHeaders } from 'better-auth/node';

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
