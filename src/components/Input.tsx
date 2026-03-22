import React from 'react';
import { TextInput, View, StyleSheet, Text, TextInputProps, ViewStyle } from 'react-native';
import { Theme } from '../theme/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  containerStyle,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Theme.colors.neutral[400]}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
  },
  label: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '600' as const,
    color: Theme.colors.neutral[700],
    marginBottom: Theme.spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface.light,
    borderWidth: 1,
    borderColor: Theme.colors.neutral[300],
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    height: 50,
  },
  inputError: {
    borderColor: Theme.colors.danger[500],
  },
  input: {
    flex: 1,
    fontSize: Theme.typography.fontSize.base,
    color: Theme.colors.neutral[900],
    padding: 0,
  },
  icon: {
    fontSize: Theme.typography.fontSize.lg,
    marginRight: Theme.spacing.sm,
  },
  errorText: {
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.danger[500],
    marginTop: Theme.spacing.xs,
  },
});
