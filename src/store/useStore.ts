import create from 'zustand';

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
}

interface AppState {
  // Estado de búsqueda
  userIngredients: string[];
  setUserIngredients: (ingredients: string[]) => void;

  // Estado de recetas
  currentRecipes: Recipe[];
  setCurrentRecipes: (recipes: Recipe[]) => void;
  addRecipe: (recipe: Recipe) => void;

  // Estado UI
  isSearching: boolean;
  searchingError: string | null;
  setIsSearching: (isSearching: boolean) => void;
  setSearchingError: (error: string | null) => void;

  // Modo
  mode: 'emergency' | 'normal' | 'chat';
  setMode: (mode: 'emergency' | 'normal' | 'chat') => void;

  // Chat
  chatMessages: Array<{ role: 'user' | 'assistant'; content: string }>;
  addChatMessage: (message: { role: 'user' | 'assistant'; content: string }) => void;
  clearChat: () => void;

  // Recetas favoritas
  favoriteRecipes: string[];
  toggleFavorite: (recipeId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // Estado inicial
  userIngredients: [],
  currentRecipes: [],
  isSearching: false,
  searchingError: null,
  mode: 'normal',
  chatMessages: [],
  favoriteRecipes: [],

  // Actions
  setUserIngredients: (ingredients) => set({ userIngredients: ingredients }),
  setCurrentRecipes: (recipes) => set({ currentRecipes: recipes }),
  addRecipe: (recipe) => set((state) => ({
    currentRecipes: [...state.currentRecipes, recipe]
  })),
  setIsSearching: (isSearching) => set({ isSearching }),
  setSearchingError: (error) => set({ searchingError: error }),
  setMode: (mode) => set({ mode }),
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message]
  })),
  clearChat: () => set({ chatMessages: [] }),
  toggleFavorite: (recipeId) => set((state) => ({
    favoriteRecipes: state.favoriteRecipes.includes(recipeId)
      ? state.favoriteRecipes.filter(id => id !== recipeId)
      : [...state.favoriteRecipes, recipeId]
  })),
}));
