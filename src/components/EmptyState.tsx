import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../theme/theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionText && onAction && (
        <Button
          title={actionText}
          onPress={onAction}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
};

export const RecipeEmptyState: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => (
  <EmptyState
    icon="🍽️"
    title="No hay recetas aún"
    description="Agrega tus ingredientes y genera recetas deliciosas"
    actionText="Buscar recetas"
    onAction={onGoBack}
  />
);

export const IngredientEmptyState: React.FC = () => (
  <EmptyState
    icon="🥦"
    title="Tu nevera está vacía"
    description="Agrega ingredientes arriba para empezar a cocinar"
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
    minHeight: 400,
  },
  icon: {
    fontSize: 64,
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontSize: Theme.typography.fontSize['2xl'],
    fontWeight: 'bold' as const,
    color: Theme.colors.neutral[800],
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  description: {
    fontSize: Theme.typography.fontSize.base,
    color: Theme.colors.neutral[600],
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
    lineHeight: Theme.typography.lineHeight.relaxed,
  },
  button: {
    minWidth: 200,
  },
});
