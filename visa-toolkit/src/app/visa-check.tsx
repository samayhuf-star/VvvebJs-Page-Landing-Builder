import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@/components/Card';
import { Disclaimer } from '@/components/Disclaimer';
import { PressableScale } from '@/components/PressableScale';
import { Screen } from '@/components/Screen';
import { SelectField } from '@/components/SelectField';
import { VerdictCard } from '@/components/VerdictCard';
import { DESTINATIONS, PASSPORTS } from '@/data/countries';
import { usePassport } from '@/lib/passport';
import { STATUS_META, summaryFor, visaFor } from '@/lib/visa';
import { accents, colors } from '@/theme';

export default function VisaCheck() {
  const { passport, setPassport } = usePassport();
  const [dest, setDest] = useState<string | null>(null);
  const accent = accents.visa;

  const info = passport && dest ? visaFor(passport, dest) : null;
  const meta = info ? STATUS_META[info.status] : null;
  const summary = useMemo(() => (passport ? summaryFor(passport) : []), [passport]);

  return (
    <Screen title="Visa Check" subtitle="Pick your passport and destination to see the entry requirement." accent={accent} icon="earth">
      <SelectField label="I hold a passport from" placeholder="Select nationality" accent={accent} value={passport} onChange={setPassport} options={PASSPORTS.map((p) => ({ id: p.code, label: p.name, flag: p.flag }))} />
      <SelectField label="I’m travelling to" placeholder="Select destination" accent={accent} value={dest} onChange={setDest} options={DESTINATIONS.map((d) => ({ id: d.id, label: d.name, flag: d.flag }))} />

      {info && meta && passport && dest ? (
        <View key={`${passport}-${dest}`} style={{ marginTop: 8 }}>
          <VerdictCard
            color={meta.color}
            icon={meta.icon}
            headline={meta.headline}
            sub={meta.label !== meta.headline ? meta.label : undefined}
            verify={info.verify}
            rows={info.stay ? [{ icon: 'time', label: 'Stay allowed', value: info.stay }] : undefined}
            note={info.note}
          />
        </View>
      ) : (
        <Animated.View entering={FadeInDown.delay(150)} style={styles.empty}>
          <Ionicons name="compass" size={42} color={colors.faint} />
          <Text style={styles.emptyText}>Choose both fields to see your result</Text>
        </Animated.View>
      )}

      {passport && summary.length > 0 && (
        <Animated.View entering={FadeInDown.delay(250)} style={{ marginTop: 28 }}>
          <Text style={styles.section}>All destinations for your passport</Text>
          <Card style={{ padding: 6 }}>
            {summary.map(({ dest: d, info: i }, idx) => {
              const m = STATUS_META[i.status];
              return (
                <Animated.View key={d.id} entering={FadeInDown.delay(300 + idx * 40)}>
                  <PressableScale onPress={() => setDest(d.id)} scaleTo={0.985} style={[styles.row, dest === d.id && { backgroundColor: accent + '1F' }]}>
                    <Text style={{ fontSize: 22 }}>{d.flag}</Text>
                    <Text style={styles.rowName}>{d.name}</Text>
                    <View style={[styles.pill, { backgroundColor: m.color + '26' }]}>
                      <View style={[styles.dot, { backgroundColor: m.color }]} />
                      <Text style={[styles.pillText, { color: m.color }]}>{m.label}</Text>
                    </View>
                  </PressableScale>
                </Animated.View>
              );
            })}
          </Card>
        </Animated.View>
      )}
      <Disclaimer />
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', gap: 10, paddingVertical: 36 },
  emptyText: { color: colors.faint, fontSize: 15 },
  section: { color: colors.muted, fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10, marginLeft: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14 },
  rowName: { flex: 1, color: colors.text, fontSize: 15.5, fontWeight: '600' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  pillText: { fontSize: 12, fontWeight: '800' },
});
