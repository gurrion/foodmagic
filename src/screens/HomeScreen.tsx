import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useStore } from '../store/useStore';
import * as ImagePicker from 'expo-image-picker';
import { generateRecipes, showInterstitial, incrementSearchCount } from '../services';
import { Theme } from '../theme/theme';
import { Button, Input, Badge, Card, IngredientEmptyState } from '../components';

export default function HomeScreen({ navigation }: any) {
  const [ingredientInput, setIngredientInput] = useState('');
  const {
    userIngredients,
    setUserIngredients,
    mode,
    setMode,
    setIsSearching,
    setSearchingError,
    setCurrentRecipes,
  } = useStore();

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setUserIngredients([...userIngredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const removeIngredient = (index: number) => {
    setUserIngredients(userIngredients.filter((_, i) => i !== index));
  };

  const handleSearch = async () => {
    if (userIngredients.length === 0) {
      setSearchingError('Agrega al menos un ingrediente');
      return;
    }

    setIsSearching(true);
    setSearchingError(null);

    try {
      const response = await generateRecipes(userIngredients, mode);
      setCurrentRecipes(
        response.recipes.map((r, i) => ({
          id: `${Date.now()}-${i}`,
          ...r,
          createdAt: new Date(),
        }))
      );

      if (incrementSearchCount()) {
        setTimeout(() => showInterstitial(), 1000);
      }

      navigation.navigate('Recipes');
    } catch (error) {
      setSearchingError(error instanceof Error ? error.message : 'Error al buscar recetas');
    } finally {
      setIsSearching(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      // TODO: Integrar GPT Vision
      navigation.navigate('Chat', {
        initialMessage: '📸 Tengo una foto de mi nevera. ¿Puedes ayudarme a identificar los ingredientes?',
      });
    }
  };

  const renderIngredient = ({ item, index }: { item: string; index: number }) => (
    <Card variant="outlined" padding="sm" style={styles.ingredientCard}>
      <View style={styles.ingredientRow}>
        <Text style={styles.ingredientText}>• {item}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeIngredient(index)}
          activeOpacity={0.7}
        >
          <Text style={styles.removeIcon}>✕</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🍳</Text>
          <Text style={styles.title}>FoodMagic</Text>
          <Text style={styles.subtitle}>Cocina con lo que tienes</Text>
        </View>

        {/* Mode Selector */}
        <Card elevation="sm" padding="md" style={styles.modeCard}>
          <Text style={styles.modeLabel}>Modo de cocina</Text>
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'normal' && styles.modeActive]}
              onPress={() => setMode('normal')}
              activeOpacity={0.7}
            >
              <Text style={[styles.modeText, mode === 'normal' && styles.modeTextActive]}>
                Normal
              </Text>
              <Text style={styles.modeSubtext}>Recetas equilibradas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'emergency' && styles.modeActive]}
              onPress={() => setMode('emergency')}
              activeOpacity={0.7}
            >
              <Text style={[styles.modeText, mode === 'emergency' && styles.modeTextActive]}>
                🚨 Emergencia
              </Text>
              <Text style={styles.modeSubtext}>¡Ya!</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Ingredient Input */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionLabel}>Ingredientes</Text>
          <Input
            placeholder="Ej: huevos, tomate, arroz..."
            value={ingredientInput}
            onChangeText={setIngredientInput}
            onSubmitEditing={addIngredient}
            icon="➕"
            returnKeyType="done"
          />
        </View>

        {/* Ingredient List */}
        {userIngredients.length > 0 ? (
          <View style={styles.ingredientsSection}>
            <View style={styles.ingredientsHeader}>
              <Text style={styles.ingredientsTitle}>
                {userIngredients.length} {userIngredients.length === 1 ? 'ingrediente' : 'ingredientes'}
              </Text>
              <TouchableOpacity onPress={() => setUserIngredients([])} activeOpacity={0.7}>
                <Text style={styles.clearAllText}>Limpiar todo</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={userIngredients}
              renderItem={renderIngredient}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.ingredientsList}
            />
          </View>
        ) : (
          <IngredientEmptyState />
        )}

        {/* Photo Button */}
        <Button
          title="📸 Tomar foto de la nevera"
          onPress={pickImage}
          variant="secondary"
          style={styles.photoButton}
        />

        {/* Generate Button */}
        <Button
          title="✨ Generar recetas"
          onPress={handleSearch}
          variant="primary"
          size="lg"
          fullWidth
          disabled={userIngredients.length === 0}
          style={styles.generateButton}
        />

        {/* Chat CTA */}
        <Card
          variant="flat"
          padding="md"
          style={styles.chatCard}
          onPress={() => navigation.navigate('Chat')}
        >
          <View style={styles.chatContent}>
            <View style={styles.chatIconContainer}>
              <Text style={styles.chatIcon}>👨‍🍳</Text>
            </View>
            <View style={styles.chatTextContainer}>
              <Text style={styles.chatTitle}>Pregúntale al Chef</Text>
              <Text style={styles.chatSubtitle}>
                Dudas sobre recetas, sustituciones, técnicas...
              </Text>
            </View>
            <Text style={styles.chatArrow}>→</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: Theme.spacing.xl,
    paddingTop: Theme.spacing['2xl'],
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: Theme.spacing.sm,
  },
  title: {
    fontSize: Theme.typography.fontSize['4xl'],
    fontWeight: 'bold' as const,
    color: Theme.colors.primary[700],
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: Theme.typography.fontSize.base,
    color: Theme.colors.neutral[600],
  },
  modeCard: {
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  modeLabel: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '600' as const,
    color: Theme.colors.neutral[700],
    marginBottom: Theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  modeButton: {
    flex: 1,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.neutral[100],
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeActive: {
    backgroundColor: Theme.colors.primary[50],
    borderColor: Theme.colors.primary[500],
  },
  modeText: {
    fontSize: Theme.typography.fontSize.base,
    fontWeight: 'bold' as const,
    color: Theme.colors.neutral[700],
    textAlign: 'center',
    marginBottom: Theme.spacing.xs,
  },
  modeTextActive: {
    color: Theme.colors.primary[700],
  },
  modeSubtext: {
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.neutral[600],
    textAlign: 'center',
  },
  inputSection: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  sectionLabel: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '600' as const,
    color: Theme.colors.neutral[700],
    marginBottom: Theme.spacing.sm,
    marginLeft: Theme.spacing.xs,
  },
  ingredientsSection: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  ingredientsTitle: {
    fontSize: Theme.typography.fontSize.base,
    fontWeight: '600' as const,
    color: Theme.colors.neutral[800],
  },
  clearAllText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.danger[500],
    fontWeight: '600' as const,
  },
  ingredientsList: {
    paddingBottom: Theme.spacing.sm,
  },
  ingredientCard: {
    marginBottom: Theme.spacing.sm,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientText: {
    fontSize: Theme.typography.fontSize.base,
    color: Theme.colors.neutral[800],
    flex: 1,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.danger[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    color: Theme.colors.danger[500],
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
  photoButton: {
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  generateButton: {
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  chatCard: {
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.accent[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  chatIcon: {
    fontSize: 24,
  },
  chatTextContainer: {
    flex: 1,
  },
  chatTitle: {
    fontSize: Theme.typography.fontSize.base,
    fontWeight: 'bold' as const,
    color: Theme.colors.neutral[800],
    marginBottom: 2,
  },
  chatSubtitle: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.neutral[600],
  },
  chatArrow: {
    fontSize: 20,
    color: Theme.colors.neutral[400],
    fontWeight: 'bold' as const,
  },
});
