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
  SafeAreaView,
} from 'react-native';
import { useStore } from '../store/useStore';
import { chatWithChef } from '../services/recipeService';
import { Theme } from '../theme/theme';
import { Card, Button, AdBanner } from '../components';

export default function ChatScreen({ navigation, route }: any) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { chatMessages, addChatMessage, clearChat } = useStore();

  // Mensaje de bienvenida o mensaje inicial desde navegación
  useEffect(() => {
    if (chatMessages.length === 0) {
      addChatMessage({
        role: 'assistant',
        content: '¡Hola! 👋 Soy tu Chef Virtual.\n\n¿Tienes alguna duda sobre recetas? ¿Quieres saber cómo sustituir un ingrediente? ¿Necesitas técnicas de cocina?\n\n¡Pregúntame lo que quieras! 👨‍🍳',
      });
    }

    // Si viene con un mensaje inicial (ej: desde Home con foto)
    if (route.params?.initialMessage) {
      const initialMsg = route.params.initialMessage;
      setInputText(initialMsg);
    }
  }, [route.params]);

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
        content: 'Ups, algo salió mal. Intenta de nuevo en un momento. 🙏',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatMessages = () => {
    clearChat();
    addChatMessage({
      role: 'assistant',
      content: '¡Hola! 👋 Soy tu Chef Virtual.\n\n¿Tienes alguna duda sobre recetas? ¿Quieres saber cómo sustituir un ingrediente? ¿Necesitas técnicas de cocina?\n\n¡Pregúntame lo que quieras! 👨‍🍳',
    });
  };

  const quickQuestions = [
    '¿Cómo sustituir huevos?',
    '¿Cómo hacer salsa blanca?',
    '¿Qué cocinar con pollo?',
  ];

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  const renderMessage = ({ item, index }: any) => {
    const isUser = item.role === 'user';
    const showAvatar = !isUser && (index === 0 || chatMessages[index - 1]?.role === 'user');

    return (
      <View style={[styles.messageRow, isUser && styles.userMessageRow]}>
        {showAvatar && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👨‍🍳</Text>
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.assistantMessageText]}>
            {item.content}
          </Text>
          <Text style={styles.messageTime}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  const renderQuickQuestions = () => {
    if (chatMessages.length > 2 || isLoading) return null;

    return (
      <View style={styles.quickQuestions}>
        <Text style={styles.quickQuestionsTitle}>Preguntas frecuentes:</Text>
        <View style={styles.quickQuestionsGrid}>
          {quickQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickQuestionButton}
              onPress={() => handleQuickQuestion(question)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickQuestionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Chef Virtual</Text>
          <Text style={styles.headerSubtitle}>🟢 Online</Text>
        </View>
        <TouchableOpacity onPress={clearChatMessages} activeOpacity={0.7}>
          <View style={styles.headerButton}>
            <Text style={styles.headerButtonText}>🗑️</Text>
          </View>
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
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          isLoading ? (
            <View style={styles.loadingRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>👨‍🍳</Text>
              </View>
              <View style={[styles.messageBubble, styles.assistantBubble, styles.loadingBubble]}>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            </View>
          ) : renderQuickQuestions()
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
            placeholder="Escribe tu pregunta..."
            placeholderTextColor={Theme.colors.neutral[400]}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: 'bold' as const,
    color: Theme.colors.neutral[800],
  },
  headerSubtitle: {
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.success[500],
    fontWeight: '600' as const,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.md,
    alignItems: 'flex-end',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.accent[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
    marginBottom: 2,
  },
  avatarText: {
    fontSize: 18,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.xl,
    position: 'relative',
  },
  userBubble: {
    backgroundColor: Theme.colors.primary[600],
    borderBottomRightRadius: Theme.borderRadius.sm,
  },
  assistantBubble: {
    backgroundColor: Theme.colors.surface.light,
    borderWidth: 1,
    borderColor: Theme.colors.neutral[200],
    borderBottomLeftRadius: Theme.borderRadius.sm,
    ...Theme.shadows.sm,
  },
  loadingBubble: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  messageText: {
    fontSize: Theme.typography.fontSize.base,
    lineHeight: Theme.typography.lineHeight.relaxed,
  },
  userMessageText: {
    color: '#fff',
  },
  assistantMessageText: {
    color: Theme.colors.neutral[800],
  },
  messageTime: {
    fontSize: Theme.typography.fontSize.xs,
    marginTop: Theme.spacing.xs,
    opacity: 0.7,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Theme.spacing.md,
  },
  typingIndicator: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.neutral[400],
    animation: 'typing 1.4s infinite ease-in-out',
  },
  quickQuestions: {
    marginTop: Theme.spacing.md,
  },
  quickQuestionsTitle: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '600' as const,
    color: Theme.colors.neutral[600],
    marginBottom: Theme.spacing.sm,
    marginLeft: Theme.spacing.xs,
  },
  quickQuestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  quickQuestionButton: {
    backgroundColor: Theme.colors.primary[50],
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
    borderColor: Theme.colors.primary[200],
  },
  quickQuestionText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary[700],
    fontWeight: '500' as const,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface.light,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.neutral[200],
    gap: Theme.spacing.sm,
  },
  input: {
    flex: 1,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.xl,
    backgroundColor: Theme.colors.neutral[100],
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    maxHeight: 100,
    fontSize: Theme.typography.fontSize.base,
    color: Theme.colors.neutral[800],
  },
  sendButton: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.primary[600],
    justifyContent: 'center',
    minWidth: 80,
  },
  sendButtonDisabled: {
    backgroundColor: Theme.colors.neutral[300],
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold' as const,
    fontSize: Theme.typography.fontSize.sm,
    textAlign: 'center',
  },
});
