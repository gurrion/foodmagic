import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getFavoriteRecipes = async (userId: string) => {
  const favorites = await prisma.favoriteRecipe.findMany({
    where: { userId },
    include: {
      recipe: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return favorites.map((fav) => ({
    ...fav.recipe,
    isFavorite: true,
    favoriteSince: fav.createdAt,
  }));
};

export const toggleFavorite = async (userId: string, recipeId: string) => {
  const existing = await prisma.favoriteRecipe.findUnique({
    where: {
      userId_recipeId: {
        userId,
        recipeId,
      },
    },
  });

  if (existing) {
    // Remover de favoritos
    await prisma.favoriteRecipe.delete({
      where: { id: existing.id },
    });
    return { isFavorite: false };
  } else {
    // Agregar a favoritos
    await prisma.favoriteRecipe.create({
      data: {
        userId,
        recipeId,
      },
    });

    // Incrementar likes de la receta
    await prisma.recipe.update({
      where: { id: recipeId },
      data: { likes: { increment: 1 } },
    });

    return { isFavorite: true };
  }
};

export const getPublicRecipes = async (limit: number = 20, offset: number = 0) => {
  const recipes = await prisma.recipe.findMany({
    where: { isPublic: true },
    include: {
      _count: {
        select: {
          favoriteRecipes: true,
          sharedRecipes: true,
        },
      },
    },
    orderBy: {
      likes: 'desc',
    },
    take: limit,
    skip: offset,
  });

  return recipes.map((recipe) => ({
    ...recipe,
    favoritesCount: recipe._count.favoriteRecipes,
    sharesCount: recipe._count.sharedRecipes,
  }));
};

export const shareRecipe = async (userId: string, recipeId: string, comment?: string) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) {
    throw new Error('Receta no encontrada');
  }

  // Marcar como pública si no lo está
  if (!recipe.isPublic) {
    await prisma.recipe.update({
      where: { id: recipeId },
      data: { isPublic: true },
    });
  }

  // Crear registro de compartido
  const shared = await prisma.sharedRecipe.create({
    data: {
      recipeId,
      userId,
      comment,
    },
  });

  // Incrementar shares
  await prisma.recipe.update({
    where: { id: recipeId },
    data: { shares: { increment: 1 } },
  });

  // Track analytics
  await prisma.analyticsEvent.create({
    data: {
      userId,
      eventType: 'share',
      eventData: JSON.stringify({ recipeId, comment }),
    },
  });

  return shared;
};

export const getRecipeDetail = async (recipeId: string, userId?: string) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      _count: {
        select: {
          favoriteRecipes: true,
          sharedRecipes: true,
        },
      },
    },
  });

  if (!recipe) {
    throw new Error('Receta no encontrada');
  }

  // Track view analytics si hay userId
  if (userId) {
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventType: 'view_recipe',
        eventData: JSON.stringify({ recipeId }),
      },
    });
  }

  // Verificar si es favorita del usuario
  let isFavorite = false;
  if (userId) {
    const favorite = await prisma.favoriteRecipe.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });
    isFavorite = !!favorite;
  }

  return {
    ...recipe,
    favoritesCount: recipe._count.favoriteRecipes,
    sharesCount: recipe._count.sharedRecipes,
    isFavorite,
  };
};
