import { Router } from 'express';
import { getAllUsers, updateUserRole } from '../controllers/user.controller';
import { requireAdmin } from '../middlewares/require-admin'; // 

const router = Router();

// GET /api/users - Admin only, list all users
router.get('/', requireAdmin, getAllUsers);
router.put('/:id/role', requireAdmin, updateUserRole);
export default router;
