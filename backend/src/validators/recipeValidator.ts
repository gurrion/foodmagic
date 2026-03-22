import { z } from 'zod';

export const generateRecipesSchema = z.object({
  ingredients: z.array(z.string()).min(1, 'Debes proporcionar al menos un ingrediente'),
  mode: z.enum(['normal', 'emergency'], {
    errorMap: () => ({ message: 'Modo inválido. Debe ser "normal" o "emergency"' }),
  }),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1, 'El mensaje no puede estar vacío'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
});

export const toggleFavoriteSchema = z.object({
  recipeId: z.string().uuid('ID de receta inválido'),
});

export type GenerateRecipesInput = z.infer<typeof generateRecipesSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type ToggleFavoriteInput = z.infer<typeof toggleFavoriteSchema>;
