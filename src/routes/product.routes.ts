
import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
  saveContactMessage,
  subscribeNewsletter,
} from '../controllers/product.controller';
import { requireAdmin } from '../middlewares/require-admin';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', requireAdmin, createProduct);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);
router.post('/contact-us', saveContactMessage);
router.post('/newsletter-subscribe', subscribeNewsletter);

export default router;
