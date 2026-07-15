import { Request, Response } from 'express';
import { db } from '../lib/auth';
import { ObjectId } from 'mongodb';

// 👤 ১. GET /api/users - Only Admin can view the register user.
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const collection = db.collection('user');

  
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

// 🛡️ ২. PUT /api/users/:id/role - Only Admin can update any user's role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    // 🎯 To avoid TypeScript errors, declare id as a string
    const id = String(req.params.id);
    const { role } = req.body;

    // 🎯 Validate the user ID before proceeding
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid user id' });
      return;
    }

    // 🎯 Validate the role type
    if (role !== 'user' && role !== 'admin') {
      res.status(400).json({ error: 'Invalid role type' });
      return;
    }

    const collection = db.collection('user');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) }, 
      { $set: { role } },
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ message: `User role updated successfully to ${role}` });
  } catch (error) {
    console.error('Failed to update user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};
