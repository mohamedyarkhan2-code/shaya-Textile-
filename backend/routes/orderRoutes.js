import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, adminOnly, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, adminOnly, getAllOrders);

router.get('/myorders', protect, getMyOrders);

// optionalProtect: public for SHAYA- IDs (Flipkart-style), auth required for _id lookups
router.get('/:id', optionalProtect, getOrderById);

router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
