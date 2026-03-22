import { Response } from 'express';
import { generateRecipes, chatWithChef } from '../services/openaiService';
import { getFavoriteRecipes, toggleFavorite, getPublicRecipes, shareRecipe, getRecipeDetail } from '../services/recipeService';
import { generateRecipesSchema, chatMessageSchema, toggleFavoriteSchema } from '../validators/recipeValidator';
import { AuthRequest } from '../middleware/auth';

export const generateRecipesController = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = generateRecipesSchema.parse(req.body);
    const userId = req.userId;

    const result = await generateRecipes({
      ...validatedData,
      userId,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Error al generar recetas',
    });
  }
};

export const chatController = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = chatMessageSchema.parse(req.body);
    const userId = req.userId;

    const result = await chatWithChef({
      ...validatedData,
      userId,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Error al comunicar con el chef',
    });
  }
};

export const getFavoriteRecipesController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const favorites = await getFavoriteRecipes(userId);

    res.status(200).json({
      success: true,
      recipes: favorites,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener favoritos',
    });
  }
};

export const toggleFavoriteController = async (req: AuthRequest, res: Response) => {
  try {
    const { recipeId } = toggleFavoriteSchema.parse(req.params);
    const userId = req.userId!;

    const result = await toggleFavorite(userId, recipeId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Error al gestionar favoritos',
    });
  }
};

export const getPublicRecipesController = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const recipes = await getPublicRecipes(limit, offset);

    res.status(200).json({
      success: true,
      recipes,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener recetas públicas',
    });
  }
};

export const shareRecipeController = async (req: AuthRequest, res: Response) => {
  try {
    const { recipeId } = toggleFavoriteSchema.parse(req.params);
    const { comment } = req.body;
    const userId = req.userId!;

    const result = await shareRecipe(userId, recipeId, comment);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Error al compartir receta',
    });
  }
};

export const getRecipeDetailController = async (req: Request, res: Response) => {
  try {
    const { recipeId } = toggleFavoriteSchema.parse(req.params);
    const userId = (req as AuthRequest).userId;

    const recipe = await getRecipeDetail(recipeId, userId);

    res.status(200).json({
      success: true,
      ...recipe,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }

    res.status(404).json({
      success: false,
      error: error.message || 'Receta no encontrada',
    });
  }
};
