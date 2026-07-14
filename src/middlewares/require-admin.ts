import { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/auth';
import { fromNodeHeaders } from 'better-auth/node';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: 'Login required' });
    }

    if (session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access only' });
    }

    req.userId = session.user.id;
    next();
  } catch {
    res.status(500).json({ error: 'Authorization failed' });
  }
};
