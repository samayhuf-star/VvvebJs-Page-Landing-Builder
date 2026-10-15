import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { PressableScale } from './PressableScale';
import { colors } from '@/theme';

export function Chip({ label, active, onPress, accent }: { label: string; active: boolean; onPress: () => void; accent: string }) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.93} style={[styles.chip, active && { backgroundColor: accent, borderColor: accent }]} accessibilityRole="button" accessibilityState={{ selected: active }}>
      <Text style={[styles.text, active && { color: '#0B1020' }]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  text: { color: colors.text, fontSize: 14, fontWeight: '700' },
});
