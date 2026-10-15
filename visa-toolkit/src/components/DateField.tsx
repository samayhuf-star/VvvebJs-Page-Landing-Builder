import React from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius } from '@/theme';

/** Masked YYYY-MM-DD input (no native date-picker dependency, works on every platform). */
export function DateField({ label, value, onChange, accent, invalid }: { label: string; value: string; onChange: (v: string) => void; accent: string; invalid?: boolean }) {
  const format = (raw: string) => {
    const d = raw.replace(/\D/g, '').slice(0, 8);
    if (d.length > 6) return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`;
    if (d.length > 4) return `${d.slice(0, 4)}-${d.slice(4)}`;
    return d;
  };
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={(t) => onChange(format(t))}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={colors.faint}
        keyboardType="number-pad"
        maxLength={10}
        accessibilityLabel={label}
        style={[styles.input, Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null, { borderColor: invalid ? '#FF6B8B' : value.length === 10 ? accent + '99' : colors.border }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 14, color: colors.text, fontSize: 16, fontWeight: '600' },
});
