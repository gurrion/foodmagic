import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useStore } from '../store/useStore';
import * as ImagePicker from 'expo-image-picker';
import { generateRecipes, showInterstitial, incrementSearchCount } from '../services';

export default function HomeScreen({ navigation }: any) {
  const [ingredientInput, setIngredientInput] = useState('');
  const { userIngredients, setUserIngredients, mode, setMode, setIsSearching, setSearchingError, setCurrentRecipes } = useStore();

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
      Alert.alert('Sin ingredientes', 'Agrega al menos un ingrediente');
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

      // Mostrar anuncio si corresponde
      if (incrementSearchCount()) {
        setTimeout(() => showInterstitial(), 1000);
      }

      navigation.navigate('Recipes');
    } catch (error) {
      setSearchingError(error instanceof Error ? error.message : 'Error al buscar recetas');
      Alert.alert('Error', 'No se pudieron generar recetas. Intenta de nuevo.');
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
      // Aquí integraríamos reconocimiento de imagen (GPT Vision)
      // Por ahora, simulamos extraer ingredientes de la imagen
      Alert.alert(
        '📸 Próximamente',
        'Reconocimiento de imagen coming soon. Por ahora agrega ingredientes manualmente.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍳 FoodMagic</Text>
      <Text style={styles.subtitle}>¿Qué tienes en la nevera?</Text>

      {/* Modo selector */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'normal' && styles.activeMode]}
          onPress={() => setMode('normal')}
        >
          <Text style={[styles.modeText, mode === 'normal' && styles.activeModeText]}>
            Normal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'emergency' && styles.activeMode]}
          onPress={() => setMode('emergency')}
        >
          <Text style={[styles.modeText, mode === 'emergency' && styles.activeModeText]}>
            🚨 Emergencia
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input de ingredientes */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ej: huevos, tomate, arroz..."
          value={ingredientInput}
          onChangeText={setIngredientInput}
          onSubmitEditing={addIngredient}
        />
        <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de ingredientes */}
      <FlatList
        style={styles.ingredientsList}
        data={userIngredients}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.ingredientItem}>
            <Text style={styles.ingredientText}>• {item}</Text>
            <TouchableOpacity onPress={() => removeIngredient(index)}>
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Agrega ingredientes arriba</Text>
        }
      />

      {/* Botón de foto */}
      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Text style={styles.photoButtonText}>📸 O toma foto de tu nevera</Text>
      </TouchableOpacity>

      {/* Botón buscar */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>✨ Generar recetas</Text>
      </TouchableOpacity>

      {/* Chat */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigation.navigate('Chat')}
      >
        <Text style={styles.chatButtonText}>💬 Pregúntale al Chef</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2d3436',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    marginBottom: 20,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#dfe6e9',
  },
  activeMode: {
    backgroundColor: '#6c5ce7',
  },
  modeText: {
    textAlign: 'center',
    color: '#2d3436',
    fontWeight: '600',
  },
  activeModeText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  ingredientsList: {
    flex: 1,
    marginBottom: 10,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 16,
    color: '#2d3436',
  },
  removeText: {
    color: '#e74c3c',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#b2bec3',
    marginTop: 20,
  },
  photoButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#00b894',
    alignItems: 'center',
    marginBottom: 10,
  },
  photoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#6c5ce7',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatButton: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fdcb6e',
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#2d3436',
    fontSize: 16,
    fontWeight: '600',
  },
});
