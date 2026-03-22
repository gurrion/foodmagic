import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../theme/theme';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md';
  icon?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
  size = 'md',
  icon,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'success': return Theme.colors.success[100];
      case 'danger': return Theme.colors.danger[100];
      case 'warning': return Theme.colors.accent[100];
      case 'info': return Theme.colors.primary[100];
      default: return Theme.colors.primary[100];
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'success': return Theme.colors.success[700];
      case 'danger': return Theme.colors.danger[700];
      case 'warning': return Theme.colors.accent[700];
      case 'info': return Theme.colors.primary[700];
      default: return Theme.colors.primary[700];
    }
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
        },
        size === 'sm' && styles.badgeSm,
      ]}
    >
      {icon && <Text style={[styles.icon, { color: getTextColor() }]}>{icon}</Text>}
      <Text style={[styles.text, { color: getTextColor(), fontSize: size === 'sm' ? 11 : 12 }]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 2,
  },
  text: {
    fontWeight: '600',
    fontSize: 12,
  },
  icon: {
    marginRight: 4,
    fontSize: 14,
  },
});
