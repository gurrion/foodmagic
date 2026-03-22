import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useStore } from '../store/useStore';
import { chatWithChef } from '../services/recipeService';
import { AdBanner } from '../components/AdBanner';

export default function ChatScreen({ navigation }: any) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { chatMessages, addChatMessage, clearChat } = useStore();

  useEffect(() => {
    // Mensaje de bienvenida si está vacío
    if (chatMessages.length === 0) {
      addChatMessage({
        role: 'assistant',
        content: '¡Hola! Soy tu chef virtual. ¿Tienes dudas sobre una receta? ¿Quieres saber cómo sustituir un ingrediente? ¡Pregúntame lo que quieras! 👨‍🍳'
      });
    }
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    addChatMessage({ role: 'user', content: userMessage });
    setIsLoading(true);

    try {
      const response = await chatWithChef(userMessage, chatMessages);
      addChatMessage({ role: 'assistant', content: response.message });
    } catch (error) {
      addChatMessage({
        role: 'assistant',
        content: 'Ups, algo salió mal. Intenta de nuevo en un momento.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatMessages = () => {
    Alert.alert(
      'Limpiar chat',
      '¿Borrar todo el historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: () => {
            clearChat();
            addChatMessage({
              role: 'assistant',
              content: '¡Hola! Soy tu chef virtual. ¿Tienes dudas sobre una receta? ¿Quieres saber cómo sustituir un ingrediente? ¡Pregúntame lo que quieras! 👨‍🍳'
            });
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }: any) => (
    <View style={[
      styles.messageBubble,
      item.role === 'user' ? styles.userMessage : styles.assistantMessage,
    ]}>
      <Text style={[
        styles.messageText,
        item.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
      ]}>
        {item.content}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chef Virtual 👨‍🍳</Text>
        <TouchableOpacity onPress={clearChatMessages}>
          <Text style={styles.clearText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Banner ad */}
      <AdBanner />

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        style={styles.messagesList}
        data={chatMessages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          isLoading ? (
            <View style={styles.loadingBubble}>
              <Text style={styles.loadingText}>Escribiendo...</Text>
            </View>
          ) : null
        }
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Pregunta algo..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.disabledButton]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  clearText: {
    fontSize: 20,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
    paddingBottom: 5,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6c5ce7',
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userMessageText: {
    color: '#fff',
  },
  assistantMessageText: {
    color: '#2d3436',
  },
  loadingBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#dfe6e9',
    padding: 10,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    marginBottom: 10,
    marginLeft: 15,
  },
  loadingText: {
    fontSize: 14,
    color: '#636e72',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#dfe6e9',
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dfe6e9',
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#6c5ce7',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#dfe6e9',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
