import { Router } from 'express';
import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from '../controllers/order.controller';
import { requireAdmin } from '../middlewares/require-admin'; 

const router = Router();

router.post('/', createOrder);
router.get('/', requireAdmin, getOrders);
router.put('/:id/status', requireAdmin, updateOrderStatus);

export default router;
