import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useStore } from '../store/useStore';
import { Theme } from '../theme/theme';
import { Badge, Card, SkeletonList, RecipeEmptyState, AdBanner } from '../components';

export default function RecipesScreen({ navigation }: any) {
  const { currentRecipes, favoriteRecipes, toggleFavorite, isSearching } = useStore();

  const getDifficultyBadge = (difficulty: string) => {
    const map: Record<string, { text: string; variant: 'success' | 'warning' | 'danger' }> = {
      easy: { text: 'Fácil', variant: 'success' },
      medium: { text: 'Medio', variant: 'warning' },
      hard: { text: 'Difícil', variant: 'danger' },
    };
    return map[difficulty] || { text: difficulty, variant: 'info' as const };
  };

  const renderRecipe = ({ item }: any) => {
    const difficultyBadge = getDifficultyBadge(item.difficulty);
    const isFavorite = favoriteRecipes.includes(item.id);

    return (
      <Card
        elevation="sm"
        padding="lg"
        style={styles.recipeCard}
        onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
      >
        {/* Header */}
        <View style={styles.recipeHeader}>
          <View style={styles.recipeTitleContainer}>
            <Text style={styles.recipeTitle} numberOfLines={2}>
              {item.title}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {/* Meta */}
        <View style={styles.recipeMeta}>
          <Badge text={difficultyBadge.text} variant={difficultyBadge.variant} size="sm" />
          <Badge text={`⏱️ ${item.cookingTime}`} variant="info" size="sm" />
          <Badge text={`🔥 ${item.calories || '-'} cal`} variant="primary" size="sm" />
        </View>

        {/* Ingredients Preview */}
        <View style={styles.ingredientsPreview}>
          <Text style={styles.ingredientsTitle}>Ingredientes:</Text>
          <Text style={styles.ingredientsText} numberOfLines={2}>
            {item.ingredients.slice(0, 3).join(', ')}
            {item.ingredients.length > 3 ? '...' : ''}
          </Text>
        </View>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tags}>
            {item.tags.slice(0, 2).map((tag: string, i: number) => (
              <Badge key={i} text={tag} variant="outline" size="sm" style={styles.tag} />
            ))}
          </View>
        )}
      </Card>
    );
  };

  if (isSearching) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Recetas</Text>
          <View style={styles.spacer} />
        </View>
        <View style={styles.content}>
          <SkeletonList count={3} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Recetas</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Favorites')}
          activeOpacity={0.7}
        >
          <Text style={styles.favoritesText}>❤️ Favoritos</Text>
        </TouchableOpacity>
      </View>

      {/* Banner ad */}
      <AdBanner />

      {/* Content */}
      {currentRecipes.length === 0 ? (
        <View style={styles.content}>
          <RecipeEmptyState onGoBack={() => navigation.goBack()} />
        </View>
      ) : (
        <FlatList
          data={currentRecipes}
          renderItem={renderRecipe}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.surface.light,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[200],
  },
  backText: {
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.primary[600],
    fontWeight: '600' as const,
  },
  title: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: 'bold' as const,
    color: Theme.colors.neutral[800],
  },
  spacer: {
    width: 24,
  },
  favoritesText: {
    fontSize: Theme.typography.fontSize.base,
    color: Theme.colors.danger[500],
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.lg,
  },
  list: {
    padding: Theme.spacing.lg,
  },
  recipeCard: {
    marginBottom: Theme.spacing.md,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.md,
  },
  recipeTitleContainer: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  recipeTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: 'bold' as const,
    color: Theme.colors.neutral[800],
    lineHeight: Theme.typography.lineHeight.tight,
  },
  favoriteButton: {
    padding: Theme.spacing.xs,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  recipeMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.xs,
    marginBottom: Theme.spacing.md,
  },
  ingredientsPreview: {
    backgroundColor: Theme.colors.neutral[50],
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  ingredientsTitle: {
    fontSize: Theme.typography.fontSize.xs,
    fontWeight: '600' as const,
    color: Theme.colors.neutral[600],
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ingredientsText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.neutral[700],
    lineHeight: Theme.typography.lineHeight.relaxed,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.xs,
  },
  tag: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
  },
});
