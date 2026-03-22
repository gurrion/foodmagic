import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useStore } from '../store/useStore';

export default function RecipeDetailScreen({ route, navigation }: any) {
  const { recipe } = route.params;
  const { favoriteRecipes, toggleFavorite } = useStore();

  const isFavorite = favoriteRecipes.includes(recipe.id);

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

  const shareRecipe = () => {
    Alert.alert(
      '📤 Compartir',
      'Próximamente: podrás compartir recetas en redes sociales'
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => toggleFavorite(recipe.id)}>
              <Text style={styles.actionText}>{isFavorite ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={shareRecipe} style={styles.shareButton}>
              <Text style={styles.actionText}>📤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recipe info */}
        <View style={styles.content}>
          <Text style={styles.title}>{recipe.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaTag}>
              <Text style={[styles.metaText, { color: getDifficultyColor(recipe.difficulty) }]}>
                {getDifficultyText(recipe.difficulty)}
              </Text>
            </View>
            <View style={styles.metaTag}>
              <Text style={styles.metaText}>⏱️ {recipe.cookingTime}</Text>
            </View>
          </View>

          {/* Ingredients */}
          <Text style={styles.sectionTitle}>Ingredientes</Text>
          <View style={styles.section}>
            {recipe.ingredients.map((ingredient: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>{ingredient}</Text>
              </View>
            ))}
          </View>

          {/* Instructions */}
          <Text style={styles.sectionTitle}>Instrucciones</Text>
          <View style={styles.section}>
            {recipe.instructions.map((step: string, index: number) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* Tips */}
          <View style={styles.tipsBox}>
            <Text style={styles.tipsTitle}>💡 Tip</Text>
            <Text style={styles.tipsText}>
              No tienes exactamente estos ingredientes? Pregúntale al Chef en el chat si puedes sustituirlos.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('Chat')}
        >
          <Text style={styles.chatButtonText}>💬 Pregúntale al Chef</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6e9',
  },
  backText: {
    fontSize: 24,
    color: '#6c5ce7',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  actionText: {
    fontSize: 24,
  },
  shareButton: {
    marginLeft: 10,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 15,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },
  metaTag: {
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#dfe6e9',
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 12,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listBullet: {
    fontSize: 18,
    color: '#6c5ce7',
    marginRight: 10,
    marginTop: 2,
  },
  listText: {
    fontSize: 16,
    color: '#2d3436',
    flex: 1,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 16,
    color: '#2d3436',
    flex: 1,
    lineHeight: 22,
  },
  tipsBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#dfe6e9',
  },
  chatButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fdcb6e',
    alignItems: 'center',
    shadowColor: '#fdcb6e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  chatButtonText: {
    color: '#2d3436',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
