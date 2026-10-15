import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';

export function Disclaimer({ text }: { text?: string }) {
  return (
    <View style={styles.box}>
      <Ionicons name="information-circle" size={18} color={colors.muted} style={{ marginTop: 1 }} />
      <Text style={styles.text}>{text ?? 'Guidance only — immigration rules change often. Always confirm with the official embassy, consulate or government portal and your airline before you travel.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', gap: 10, padding: 14, marginTop: 22, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.04)' },
  text: { flex: 1, color: colors.muted, fontSize: 12.5, lineHeight: 18 },
});
