import { Router } from 'express';
import {
  generateRecipesController,
  chatController,
  getFavoriteRecipesController,
  toggleFavoriteController,
  getPublicRecipesController,
  shareRecipeController,
  getRecipeDetailController,
} from '../controllers/recipeController';
import { authMiddleware, optionalAuth } from '../middleware/auth';

const router = Router();

// Público (con autenticación opcional)
router.get('/public', optionalAuth, getPublicRecipesController);
router.get('/:recipeId', optionalAuth, getRecipeDetailController);

// Protegido
router.post('/generate', authMiddleware, generateRecipesController);
router.post('/chat', authMiddleware, chatController);
router.get('/favorites', authMiddleware, getFavoriteRecipesController);
router.post('/:recipeId/favorite', authMiddleware, toggleFavoriteController);
router.post('/:recipeId/share', authMiddleware, shareRecipeController);

export default router;
