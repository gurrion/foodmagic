import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Theme } from '../theme/theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  style,
}) => {
  return (
    <View
      style={[
        styles.skeleton,
        { width, height },
        style,
      ]}
    />
  );
};

export const SkeletonCard: React.FC = () => (
  <View style={styles.cardSkeleton}>
    <SkeletonLoader width={150} height={20} />
    <View style={styles.metaRow}>
      <SkeletonLoader width={60} height={16} style={styles.badgeSkeleton} />
      <SkeletonLoader width={50} height={16} style={styles.badgeSkeleton} />
    </View>
    <SkeletonLoader width={200} height={14} style={styles.textSkeleton} />
    <SkeletonLoader width={150} height={14} style={styles.textSkeleton} />
  </View>
);

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Theme.colors.neutral[200],
    borderRadius: Theme.borderRadius.sm,
    overflow: 'hidden',
  },
  cardSkeleton: {
    backgroundColor: Theme.colors.surface.light,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  badgeSkeleton: {
    width: 60,
    height: 24,
  },
  textSkeleton: {
    marginTop: Theme.spacing.xs,
  },
});
