import { Request, Response } from 'express';
import { db } from '../lib/auth';

// GET /api/users - Admin only, list all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const collection = db.collection('user');

    // Remove the password field from the user documents before sending the response
    const rawUsers = await collection.find().sort({ createdAt: -1 }).toArray();

    const users = rawUsers.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));

    res.json({ users });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
