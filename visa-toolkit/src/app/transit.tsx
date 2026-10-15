import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Disclaimer } from '@/components/Disclaimer';
import { Screen } from '@/components/Screen';
import { SelectField } from '@/components/SelectField';
import { VerdictCard } from '@/components/VerdictCard';
import { destById, PASSPORTS } from '@/data/countries';
import { LAYOVER_OPTIONS, TRANSIT_HUBS } from '@/data/transit';
import { usePassport } from '@/lib/passport';
import { checkTransit } from '@/lib/transit';
import { accents, colors } from '@/theme';

const VERDICT = {
  clear: { color: '#34D4A0', icon: 'checkmark-circle' },
  check: { color: '#FFB547', icon: 'alert-circle' },
  visa: { color: '#FF6B8B', icon: 'close-circle' },
} as const;

export default function Transit() {
  const { passport, setPassport } = usePassport();
  const [hub, setHub] = useState<string | null>(null);
  const [leave, setLeave] = useState(false);
  const [hours, setHours] = useState(8);
  const accent = accents.transit;

  const result = passport && hub ? checkTransit(passport, hub, leave, hours) : null;
  const hubInfo = destById(hub);

  return (
    <Screen title="Transit Visa" subtitle="Connecting through another country? See if you need a transit visa." accent={accent} icon="swap-horizontal">
      <SelectField label="I hold a passport from" placeholder="Select nationality" accent={accent} value={passport} onChange={setPassport} options={PASSPORTS.map((p) => ({ id: p.code, label: p.name, flag: p.flag }))} />
      <SelectField
        label="Transit country"
        placeholder="Select the country you connect in"
        accent={accent}
        value={hub}
        onChange={setHub}
        options={TRANSIT_HUBS.map((h) => {
          const d = destById(h.id)!;
          return { id: d.id, label: d.name, flag: d.flag, sub: d.airports };
        })}
      />

      <Text style={styles.label}>Will you leave the airport or re-check bags?</Text>
      <View style={styles.chips}>
        <Chip label="No — stay airside" active={!leave} onPress={() => setLeave(false)} accent={accent} />
        <Chip label="Yes — enter country" active={leave} onPress={() => setLeave(true)} accent={accent} />
      </View>

      {leave && (
        <Animated.View entering={FadeInDown.springify().damping(16)}>
          <Text style={styles.label}>Layover length</Text>
          <View style={styles.chips}>
            {LAYOVER_OPTIONS.map((h) => (
              <Chip key={h} label={`${h}h`} active={hours === h} onPress={() => setHours(h)} accent={accent} />
            ))}
          </View>
        </Animated.View>
      )}

      {result ? (
        <View key={`${passport}-${hub}-${leave}-${hours}`} style={{ marginTop: 22 }}>
          <VerdictCard
            color={VERDICT[result.verdict].color}
            icon={VERDICT[result.verdict].icon}
            headline={result.headline}
            sub={hubInfo ? `${hubInfo.flag} ${hubInfo.name} · ${hubInfo.airports}` : undefined}
            note={result.note}
          />
          <Card style={{ marginTop: 14 }}>
            <Text style={styles.stepsTitle}>What to do</Text>
            {result.steps.map((s, i) => (
              <Animated.View key={s} entering={FadeInDown.delay(300 + i * 80)} style={styles.step}>
                <Ionicons name="arrow-forward-circle" size={18} color={accent} style={{ marginTop: 1 }} />
                <Text style={styles.stepText}>{s}</Text>
              </Animated.View>
            ))}
          </Card>
        </View>
      ) : (
        <Animated.View entering={FadeInDown.delay(150)} style={styles.empty}>
          <Ionicons name="git-compare" size={42} color={colors.faint} />
          <Text style={styles.emptyText}>Select your passport and transit country</Text>
        </Animated.View>
      )}
      <Disclaimer text="Transit rules depend on your exact itinerary: connected tickets, airline and terminal changes. Confirm with your airline and the embassy before you fly." />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10, marginTop: 6, marginLeft: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  empty: { alignItems: 'center', gap: 10, paddingVertical: 36 },
  emptyText: { color: colors.faint, fontSize: 15 },
  stepsTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 10 },
  step: { flexDirection: 'row', gap: 10, paddingVertical: 6 },
  stepText: { flex: 1, color: colors.text, opacity: 0.9, fontSize: 14.5, lineHeight: 21 },
});
