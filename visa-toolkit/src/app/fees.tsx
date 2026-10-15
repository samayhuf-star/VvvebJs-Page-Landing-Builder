import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Chip } from '@/components/Chip';
import { Disclaimer } from '@/components/Disclaimer';
import { PressableScale } from '@/components/PressableScale';
import { Screen } from '@/components/Screen';
import { SelectField } from '@/components/SelectField';
import { PASSPORTS } from '@/data/countries';
import { FeeRow, feeRows } from '@/lib/fees';
import { usePassport } from '@/lib/passport';
import { STATUS_META } from '@/lib/visa';
import { accents, colors, radius } from '@/theme';

type Sort = 'fee' | 'time' | 'name';
const MAX_USD = 200;

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withTiming(Math.max(0.04, Math.min(1, value / max)), { duration: 700 });
  }, [value, max, w]);
  const style = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { backgroundColor: color }, style]} />
    </View>
  );
}

export default function Fees() {
  const { passport, setPassport } = usePassport();
  const [sort, setSort] = useState<Sort>('fee');
  const [open, setOpen] = useState<string | null>(null);
  const accent = accents.fees;

  const rows = useMemo(() => {
    if (!passport) return [] as FeeRow[];
    const list = feeRows(passport).filter((r) => r.status !== 'citizen');
    const key = (r: FeeRow) => (sort === 'fee' ? r.fee?.usd ?? 9999 : sort === 'time' ? r.fee?.days ?? 9999 : 0);
    return list.sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : key(a) - key(b)));
  }, [passport, sort]);

  return (
    <Screen title="Fees & Timing" subtitle="Compare what each destination costs and how long it takes for your passport." accent={accent} icon="cash">
      <SelectField label="I hold a passport from" placeholder="Select nationality" accent={accent} value={passport} onChange={setPassport} options={PASSPORTS.map((p) => ({ id: p.code, label: p.name, flag: p.flag }))} />

      {passport ? (
        <>
          <View style={styles.chips}>
            <Chip label="Lowest fee" active={sort === 'fee'} onPress={() => setSort('fee')} accent={accent} />
            <Chip label="Fastest" active={sort === 'time'} onPress={() => setSort('time')} accent={accent} />
            <Chip label="A–Z" active={sort === 'name'} onPress={() => setSort('name')} accent={accent} />
          </View>
          {rows.map((r, i) => {
            const m = STATUS_META[r.status];
            const expanded = open === r.id;
            return (
              <Animated.View key={r.id} entering={FadeInDown.delay(i * 45).springify().damping(16)} layout={LinearTransition.springify().damping(18)}>
                <PressableScale onPress={() => setOpen(expanded ? null : r.id)} scaleTo={0.985} style={styles.card}>
                  <View style={styles.top}>
                    <Text style={{ fontSize: 26 }}>{r.flag}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>{r.name}</Text>
                      <Text style={[styles.status, { color: m.color }]}>{m.label}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.price}>{r.fee?.display ?? '—'}</Text>
                      <Text style={styles.time}>{r.fee && r.fee.days > 0 ? `~${r.fee.processing.replace(/^~/, '')}` : r.fee ? 'No wait' : ''}</Text>
                    </View>
                  </View>
                  <Bar value={r.fee?.usd ?? 0} max={MAX_USD} color={r.fee && r.fee.usd === 0 ? '#34D4A0' : accent} />
                  {expanded && r.fee && (
                    <Animated.View entering={FadeInDown.duration(250)} style={styles.detail}>
                      <Detail icon="pricetag" label="Type" value={r.fee.label} />
                      <Detail icon="time" label="Processing" value={r.fee.processing} />
                      {r.fee.validity ? <Detail icon="calendar" label="Validity" value={r.fee.validity} /> : null}
                    </Animated.View>
                  )}
                </PressableScale>
              </Animated.View>
            );
          })}
        </>
      ) : (
        <Animated.View entering={FadeInDown.delay(150)} style={styles.empty}>
          <Ionicons name="wallet" size={42} color={colors.faint} />
          <Text style={styles.emptyText}>Select your passport to compare costs</Text>
        </Animated.View>
      )}
      <Disclaimer text="Government fees are approximate and in tourist-visa terms; service-centre, courier and agent fees are extra. Exchange rates are indicative. Tap a row for details." />
    </Screen>
  );
}

function Detail({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.dRow}>
      <Ionicons name={icon} size={16} color={colors.muted} />
      <Text style={styles.dLabel}>{label}</Text>
      <Text style={styles.dValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  card: { padding: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 10 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  name: { color: colors.text, fontSize: 16, fontWeight: '800' },
  status: { fontSize: 12.5, fontWeight: '800', marginTop: 2 },
  price: { color: colors.text, fontSize: 18, fontWeight: '800' },
  time: { color: colors.muted, fontSize: 12, marginTop: 2, maxWidth: 140, textAlign: 'right' },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.surfaceStrong, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  detail: { marginTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: 6 },
  dRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  dLabel: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  dValue: { flex: 1, color: colors.text, fontSize: 13.5, fontWeight: '700', textAlign: 'right' },
  empty: { alignItems: 'center', gap: 10, paddingVertical: 36 },
  emptyText: { color: colors.faint, fontSize: 15 },
});
