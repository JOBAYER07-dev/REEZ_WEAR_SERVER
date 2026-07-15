import { Router } from 'express';
import { getAllUsers } from '../controllers/user.controller';
import { requireAdmin } from '../middlewares/require-admin'; // 

const router = Router();

// GET /api/users - Admin only, list all users
router.get('/', requireAdmin, getAllUsers);

export default router;
