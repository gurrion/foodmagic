import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Theme } from '../theme/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  elevation = 'sm',
  padding = 'md',
  variant = 'elevated',
}) => {
  const cardStyle: ViewStyle = {
    backgroundColor: Theme.colors.surface.light,
    borderRadius: Theme.borderRadius.lg,
    padding: padding === 'none' ? 0 : Theme.spacing[padding],
  };

  const getShadow = () => {
    if (variant === 'outlined') return {};
    if (variant === 'flat') return Theme.shadows.xs;
    return Theme.shadows[elevation];
  };

  const getBorder = () => {
    if (variant === 'outlined') {
      return {
        borderWidth: 1,
        borderColor: Theme.colors.neutral[300],
      };
    }
    return {};
  };

  return (
    <TouchableOpacity
      style={[styles.card, cardStyle, getShadow(), getBorder(), style]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? Theme.opacity.pressed : 1}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
