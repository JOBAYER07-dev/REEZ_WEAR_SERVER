import { Router } from 'express';
import {
  createOrder,
  getOrders,
  updateOrderStatus,
  getMyOrders,
} from '../controllers/order.controller';
import { requireAdmin } from '../middlewares/require-admin'; 

const router = Router();

router.post('/', createOrder);
router.get('/user/me', getMyOrders);
router.get('/', requireAdmin, getOrders);
router.put('/:id/status', requireAdmin, updateOrderStatus);

export default router;
