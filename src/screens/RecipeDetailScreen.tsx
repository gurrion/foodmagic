import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Share,
  Alert,
} from 'react-native';
import { useStore } from '../store/useStore';
import { Theme } from '../theme/theme';
import { Badge, Card, Button } from '../components';

export default function RecipeDetailScreen({ route, navigation }: any) {
  const { recipe } = route.params;
  const { favoriteRecipes, toggleFavorite } = useStore();
  const isFavorite = favoriteRecipes.includes(recipe.id);

  const getDifficultyBadge = (difficulty: string) => {
    const map: Record<string, { text: string; variant: 'success' | 'warning' | 'danger' }> = {
      easy: { text: 'Fácil', variant: 'success' },
      medium: { text: 'Medio', variant: 'warning' },
      hard: { text: 'Difícil', variant: 'danger' },
    };
    return map[difficulty] || { text: difficulty, variant: 'info' as const };
  };

  const shareRecipe = async () => {
    try {
      await Share.share({
        message: `¡Mira esta receta de FoodMagic!\n\n${recipe.title}\n\nIngredientes:\n${recipe.ingredients.join('\n')}\n\nDescarga FoodMagic: https://foodmagic.app`,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir la receta');
    }
  };

  const cookMode = () => {
    Alert.alert('👨‍🍳 Modo Chef', 'Próximamente: Modo manos libres con audio');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <View style={styles.headerButton}>
            <Text style={styles.headerButtonText}>←</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => toggleFavorite(recipe.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.headerButtonText}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={shareRecipe}
            activeOpacity={0.7}
          >
            <Text style={styles.headerButtonText}>📤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title Card */}
        <Card elevation="sm" padding="lg" style={styles.titleCard}>
          <Text style={styles.title}>{recipe.title}</Text>

          <View style={styles.metaRow}>
            <Badge {...getDifficultyBadge(recipe.difficulty)} />
            <Badge text={`⏱️ ${recipe.cookingTime}`} variant="info" />
            {recipe.calories && (
              <Badge text={`🔥 ${recipe.calories} cal`} variant="primary" />
            )}
          </View>

          {recipe.description && (
            <Text style={styles.description}>{recipe.description}</Text>
          )}
        </Card>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🥘 Ingredientes</Text>
          <Card padding="md">
            {recipe.ingredients.map((ingredient: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.checkCircle}>
                  <Text style={styles.checkNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.listText}>{ingredient}</Text>
              </View>
            ))}
          </Card>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Instrucciones</Text>
          {recipe.instructions.map((step: string, index: number) => (
            <Card key={index} elevation="xs" padding="md" style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepTitle}>Paso {index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </Card>
          ))}
        </View>

        {/* Tips */}
        <Card
          variant="flat"
          padding="md"
          style={styles.tipsCard}
        >
          <View style={styles.tipsHeader}>
            <Text style={styles.tipsEmoji}>💡</Text>
            <Text style={styles.tipsTitle}>Tip del Chef</Text>
          </View>
          <Text style={styles.tipsText}>
            ¿No tienes exactamente estos ingredientes? Pregúntale al Chef en el chat si puedes sustituirlos.
          </Text>
        </Card>

        {/* Footer Spacer */}
        <View style={styles.footerSpacer} />
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <Button
          title="👨‍🍳 Modo Chef"
          onPress={cookMode}
          variant="secondary"
          style={styles.fabSecondary}
        />
        <Button
          title="💬 Preguntar"
          onPress={() => navigation.navigate('Chat')}
          variant="primary"
          style={styles.fabPrimary}
        />
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.surface.light,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.neutral[200],
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 20,
    color: Theme.colors.neutral[700],
  },
  headerActions: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Theme.spacing.xxxl,
  },
  titleCard: {
    margin: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.fontSize['3xl'],
    fontWeight: 'bold' as const,
    color: Theme.colors.neutral[800],
    marginBottom: Theme.spacing.md,
    lineHeight: Theme.typography.lineHeight.tight,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.xs,
    marginBottom: Theme.spacing.md,
  },
  description: {
    fontSize: Theme.typography.fontSize.base,
    color: Theme.colors.neutral[600],
    lineHeight: Theme.typography.lineHeight.relaxed,
  },
  section: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: 'bold' as const,
    color: Theme.colors.neutral[800],
    marginBottom: Theme.spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  checkNumber: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: 'bold' as const,
    color: Theme.colors.primary[700],
  },
  listText: {
    flex: 1,
    fontSize: Theme.typography.fontSize.base,
    color: Theme.colors.neutral[800],
    lineHeight: Theme.typography.lineHeight.relaxed,
  },
  stepCard: {
    marginBottom: Theme.spacing.md,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: 'bold' as const,
  },
  stepTitle: {
    fontSize: Theme.typography.fontSize.base,
    fontWeight: 'bold' as const,
    color: Theme.colors.neutral[800],
  },
  stepText: {
    fontSize: Theme.typography.fontSize.base,
    color: Theme.colors.neutral[700],
    lineHeight: Theme.typography.lineHeight.relaxed,
    paddingLeft: 40,
  },
  tipsCard: {
    marginHorizontal: Theme.spacing.lg,
    backgroundColor: Theme.colors.primary[50],
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.primary[500],
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  tipsEmoji: {
    fontSize: 24,
    marginRight: Theme.spacing.sm,
  },
  tipsTitle: {
    fontSize: Theme.typography.fontSize.base,
    fontWeight: 'bold' as const,
    color: Theme.colors.primary[800],
  },
  tipsText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary[900],
    lineHeight: Theme.typography.lineHeight.relaxed,
  },
  footerSpacer: {
    height: Theme.spacing.xxl,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.surface.light,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.neutral[200],
    gap: Theme.spacing.sm,
  },
  fabSecondary: {
    flex: 1,
  },
  fabPrimary: {
    flex: 2,
  },
});
