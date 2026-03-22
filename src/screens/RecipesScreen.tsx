import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useStore } from '../store/useStore';
import { AdBanner } from '../components/AdBanner';

export default function RecipesScreen({ navigation }: any) {
  const { currentRecipes, favoriteRecipes, toggleFavorite } = useStore();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#00b894';
      case 'medium': return '#fdcb6e';
      case 'hard': return '#e74c3c';
      default: return '#636e72';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Medio';
      case 'hard': return 'Difícil';
      default: return '';
    }
  };

  const renderRecipe = ({ item }: any) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
    >
      <View style={styles.recipeHeader}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          <Text style={styles.favoriteText}>
            {favoriteRecipes.includes(item.id) ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recipeMeta}>
        <View style={styles.metaTag}>
          <Text style={[styles.metaText, { color: getDifficultyColor(item.difficulty) }]}>
            {getDifficultyText(item.difficulty)}
          </Text>
        </View>
        <View style={styles.metaTag}>
          <Text style={styles.metaText}>⏱️ {item.cookingTime}</Text>
        </View>
      </View>

      <Text style={styles.ingredientsPreview}>
        {item.ingredients.slice(0, 3).join(', ')}
        {item.ingredients.length > 3 ? '...' : ''}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Recetas</Text>
      </View>

      {/* Banner ad */}
      <AdBanner />

      {currentRecipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay recetas</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Buscar recetas</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={currentRecipes}
          renderItem={renderRecipe}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6e9',
  },
  backText: {
    fontSize: 16,
    color: '#6c5ce7',
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  list: {
    padding: 15,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#2d3436',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    flex: 1,
  },
  favoriteText: {
    fontSize: 24,
  },
  recipeMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  metaTag: {
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: '#dfe6e9',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ingredientsPreview: {
    fontSize: 14,
    color: '#636e72',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#b2bec3',
    marginBottom: 20,
  },
  backButton: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#6c5ce7',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
