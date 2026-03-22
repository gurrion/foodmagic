import axios from 'axios';
import prisma from '../config/database';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined');
}

interface GenerateRecipesParams {
  ingredients: string[];
  mode: 'normal' | 'emergency';
  userId?: string;
}

interface ChatParams {
  message: string;
  history: Array<{ role: string; content: string }>;
  userId?: string;
}

interface RecipeResponse {
  recipes: Array<{
    title: string;
    ingredients: string[];
    instructions: string[];
    cookingTime: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
}

interface ChatResponse {
  message: string;
}

export const generateRecipes = async (params: GenerateRecipesParams): Promise<RecipeResponse> => {
  const { ingredients, mode, userId } = params;

  try {
    const prompt = mode === 'emergency'
      ? `Tengo SOLO estos ingredientes y mucha hambre: ${ingredients.join(', ')}.
        Genera 3 recetas rápidas, fáciles y creativas usando EXCLUSIVAMENTE estos ingredientes.
        Solo puedes usar sal, pimienta y aceite (que todo el mundo tiene).
        Responde en formato JSON con este esquema:
        {
          "recipes": [
            {
              "title": "Nombre de la receta",
              "ingredients": ["ingrediente 1", "ingrediente 2"],
              "instructions": ["paso 1", "paso 2"],
              "cookingTime": "15 min",
              "difficulty": "easy"
            }
          ]
        }
        SÉ CREATIVO pero REALISTA.`
      : `Tengo estos ingredientes: ${ingredients.join(', ')}.
        Genera 3 recetas deliciosas usando estos ingredientes como base.
        Puedes agregar ingredientes comunes que probablemente tenga en casa (sal, pimienta, aceite, etc).
        Responde en formato JSON con este esquema:
        {
          "recipes": [
            {
              "title": "Nombre de la receta",
              "ingredients": ["ingrediente 1", "ingrediente 2"],
              "instructions": ["paso 1", "paso 2"],
              "cookingTime": "30 min",
              "difficulty": "medium"
            }
          ]
        }`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un chef experto creativo. Siempre respondes en JSON válido. Hablas en español.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('No se pudo parsear la respuesta');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Guardar recetas en la base de datos si hay userId
    if (userId) {
      const recipes = await Promise.all(
        parsed.recipes.map(async (recipe: any) => {
          const savedRecipe = await prisma.recipe.create({
            data: {
              title: recipe.title,
              ingredients: recipe.ingredients,
              instructions: recipe.instructions,
              cookingTime: recipe.cookingTime,
              difficulty: recipe.difficulty,
              mode,
            },
          });

          // Guardar en generated_recipes
          await prisma.generatedRecipe.create({
            data: {
              userId,
              recipeId: savedRecipe.id,
              ingredients,
            },
          });

          return savedRecipe;
        })
      );

      // Guardar en search_history
      await prisma.searchHistory.create({
        data: {
          userId,
          ingredients,
          mode,
          resultsCount: recipes.length,
        },
      });

      // Track analytics
      await prisma.analyticsEvent.create({
        data: {
          userId,
          eventType: 'search',
          eventData: JSON.stringify({ ingredients, mode, resultsCount: recipes.length }),
        },
      });
    }

    return parsed as RecipeResponse;
  } catch (error) {
    console.error('Error generating recipes:', error);
    throw new Error('Error al generar recetas. Intenta de nuevo.');
  }
};

export const chatWithChef = async (params: ChatParams): Promise<ChatResponse> => {
  const { message, history, userId } = params;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un chef experto y amigable. Das consejos prácticos de cocina. Hablas en español. Sé conciso y útil. Máximo 150 palabras por respuesta.'
          },
          ...history,
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;

    // Guardar mensajes si hay userId
    if (userId) {
      await prisma.chatMessage.createMany({
        data: [
          { userId, role: 'user', content: message },
          { userId, role: 'assistant', content },
        ],
      });

      // Track analytics
      await prisma.analyticsEvent.create({
        data: {
          userId,
          eventType: 'chat',
          eventData: JSON.stringify({ messageLength: message.length }),
        },
      });
    }

    return { message: content };
  } catch (error) {
    console.error('Error chatting:', error);
    throw new Error('Error al comunicar con el chef. Intenta de nuevo.');
  }
};
