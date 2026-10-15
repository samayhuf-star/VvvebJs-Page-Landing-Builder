import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { colors, radius } from '@/theme';

type Row = { icon: keyof typeof Ionicons.glyphMap; label: string; value: string };

export function VerdictCard({ color, icon, headline, sub, rows, note, verify }: { color: string; icon: string; headline: string; sub?: string; rows?: Row[]; note?: string; verify?: boolean }) {
  return (
    <Animated.View entering={FadeInUp.springify().damping(16)} style={[styles.card, { borderColor: color + '88', backgroundColor: color + '14' }]}>
      <Animated.View entering={ZoomIn.delay(120).springify().damping(9)} style={[styles.badge, { backgroundColor: color + '2A', borderColor: color }]}>
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={34} color={color} />
      </Animated.View>
      <Animated.Text entering={FadeInDown.delay(180)} style={[styles.headline, { color }]}>
        {headline}
      </Animated.Text>
      {sub ? (
        <Animated.Text entering={FadeInDown.delay(230)} style={styles.sub}>
          {sub}
        </Animated.Text>
      ) : null}
      {rows?.map((r, i) => (
        <Animated.View key={r.label} entering={FadeInDown.delay(280 + i * 70)} style={styles.row}>
          <Ionicons name={r.icon} size={18} color={colors.muted} />
          <Text style={styles.rowLabel}>{r.label}</Text>
          <Text style={styles.rowValue}>{r.value}</Text>
        </Animated.View>
      ))}
      {note ? (
        <Animated.Text entering={FadeInDown.delay(420)} style={styles.note}>
          {note}
        </Animated.Text>
      ) : null}
      {verify ? (
        <Animated.View entering={FadeInDown.delay(480)} style={styles.verify}>
          <Ionicons name="warning" size={15} color="#FFB547" />
          <Text style={styles.verifyText}>This policy has changed recently — double-check on the official site.</Text>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1.5, borderRadius: radius.xl, padding: 22, alignItems: 'center' },
  badge: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  headline: { fontSize: 26, fontWeight: '800', textAlign: 'center', letterSpacing: -0.4 },
  sub: { color: colors.text, fontSize: 15, textAlign: 'center', marginTop: 6, opacity: 0.85 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'stretch', paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, marginTop: 4 },
  rowLabel: { color: colors.muted, fontSize: 14, fontWeight: '600' },
  rowValue: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '700', textAlign: 'right' },
  note: { color: colors.text, opacity: 0.85, fontSize: 14, lineHeight: 21, marginTop: 10, alignSelf: 'stretch' },
  verify: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 14, padding: 10, borderRadius: 12, backgroundColor: 'rgba(255,181,71,0.12)', alignSelf: 'stretch' },
  verifyText: { flex: 1, color: '#FFB547', fontSize: 12.5, fontWeight: '600' },
});
