// src/routes/menuRoutes.js
import express from 'express';
import menuController from '../controllers/menuController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', menuController.getAllMenu);
router.get('/type/:type', menuController.getMenuByType);
router.get('/search', menuController.searchMenu);
router.get('/vegan', menuController.getVeganItems);
router.get('/allergen', menuController.getItemsByAllergen);
router.get('/:id', menuController.getMenuItem);

router.post('/', authMiddleware, menuController.createMenuItem);
router.put('/:id', authMiddleware, menuController.updateMenuItem);
router.delete('/:id', authMiddleware, menuController.deleteMenuItem);
router.put('/:id/toggle', authMiddleware, menuController.toggleAvailability);

export default router;