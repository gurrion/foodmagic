import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Theme } from '../theme/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return Theme.colors.neutral[300];
    if (variant === 'primary') return Theme.colors.primary[600];
    if (variant === 'secondary') return Theme.colors.accent[500];
    if (variant === 'success') return Theme.colors.success[500];
    if (variant === 'danger') return Theme.colors.danger[500];
    if (variant === 'outline' || variant === 'ghost') return 'transparent';
    return Theme.colors.primary[600];
  };

  const getTextColor = () => {
    if (variant === 'outline' || variant === 'ghost') return Theme.colors.primary[600];
    return '#fff';
  };

  const getBorderColor = () => {
    if (variant === 'outline') return Theme.colors.primary[600];
    return 'transparent';
  };

  const getHeight = () => {
    if (size === 'sm') return 40;
    if (size === 'lg') return 56;
    return 48;
  };

  const getFontSize = () => {
    if (size === 'sm') return Theme.typography.fontSize.sm;
    if (size === 'lg') return Theme.typography.fontSize.lg;
    return Theme.typography.fontSize.base;
  };

  const buttonStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderColor: getBorderColor(),
    borderWidth: variant === 'outline' ? 2 : 0,
    height: getHeight(),
    borderRadius: Theme.borderRadius.lg,
    opacity: disabled ? Theme.opacity.disabled : 1,
  };

  const textStyle: TextStyle = {
    color: getTextColor(),
    fontSize: getFontSize(),
    fontWeight: '600' as const,
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle,
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={Theme.opacity.pressed}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, textStyle]}>
          {icon && <Text style={styles.icon}>{icon} </Text>}
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    ...Theme.shadows.md,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    textAlign: 'center',
  },
  icon: {
    fontSize: Theme.typography.fontSize.lg,
  },
});
