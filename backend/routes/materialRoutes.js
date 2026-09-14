import express from 'express';
import {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from '../controllers/materialController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getMaterials)
  .post(protect, adminOnly, createMaterial);

router.route('/:id')
  .get(getMaterialById)
  .put(protect, adminOnly, updateMaterial)
  .delete(protect, adminOnly, deleteMaterial);

export default router;
