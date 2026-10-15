import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutRight, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Card } from '@/components/Card';
import { DateField } from '@/components/DateField';
import { Disclaimer } from '@/components/Disclaimer';
import { PressableScale } from '@/components/PressableScale';
import { Screen } from '@/components/Screen';
import { fmtDay, LIMIT, maxStayFrom, nextFreeDay, parseDay, todayDay, Trip, tripDays, usedOn, WINDOW } from '@/lib/stay';
import { load, save } from '@/lib/storage';
import { accents, colors } from '@/theme';

const KEY = 'visara:trips:v1';

function Meter({ used }: { used: number }) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withTiming(Math.min(1, used / LIMIT), { duration: 800 });
  }, [used, w]);
  const style = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  const color = used >= LIMIT ? '#FF6B8B' : used >= 75 ? '#FFB547' : '#34D4A0';
  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { backgroundColor: color }, style]} />
    </View>
  );
}

export default function Stay() {
  const accent = accents.stay;
  const [trips, setTrips] = useState<Trip[]>([]);
  const [entry, setEntry] = useState('');
  const [exit, setExit] = useState('');
  const [asOf, setAsOf] = useState(fmtDay(todayDay()));
  const [plan, setPlan] = useState('');

  useEffect(() => {
    load<Trip[]>(KEY, []).then(setTrips);
  }, []);

  const a = parseDay(entry);
  const b = parseDay(exit);
  const tripInvalid = entry.length === 10 && exit.length === 10 && (a === null || b === null || b < a);
  const canAdd = a !== null && b !== null && b >= a;

  const addTrip = () => {
    if (!canAdd) return;
    const next = [...trips, { id: String(Date.now()), entry, exit }].sort((x, y) => x.entry.localeCompare(y.entry));
    setTrips(next);
    save(KEY, next);
    setEntry('');
    setExit('');
  };
  const removeTrip = (id: string) => {
    const next = trips.filter((t) => t.id !== id);
    setTrips(next);
    save(KEY, next);
  };

  const days = useMemo(() => tripDays(trips), [trips]);
  const asOfDay = parseDay(asOf);
  const used = asOfDay !== null ? usedOn(days, asOfDay) : null;
  const remaining = used !== null ? Math.max(0, LIMIT - used) : null;
  const planDay = parseDay(plan);
  const planned = planDay !== null ? maxStayFrom(days, planDay) : null;
  const free = asOfDay !== null && remaining === 0 ? nextFreeDay(days, asOfDay) : null;

  return (
    <Screen title="Stay Calculator" subtitle={`Track the ${LIMIT}/${WINDOW}-day rule: no more than ${LIMIT} days in any ${WINDOW}-day period in the Schengen Area.`} accent={accent} icon="calendar">
      <Card>
        <Text style={styles.cardTitle}>Add a past or booked trip</Text>
        <View style={styles.dates}>
          <DateField label="Entry" value={entry} onChange={setEntry} accent={accent} invalid={tripInvalid} />
          <DateField label="Exit" value={exit} onChange={setExit} accent={accent} invalid={tripInvalid} />
        </View>
        {tripInvalid && <Text style={styles.error}>Enter valid dates — exit must be on or after entry.</Text>}
        <PressableScale onPress={addTrip} disabled={!canAdd} style={[styles.button, { backgroundColor: canAdd ? accent : colors.surfaceStrong }]} accessibilityRole="button">
          <Ionicons name="add-circle" size={20} color={canAdd ? '#0B1020' : colors.faint} />
          <Text style={[styles.buttonText, !canAdd && { color: colors.faint }]}>Add trip</Text>
        </PressableScale>
      </Card>

      {trips.length > 0 && (
        <View style={{ marginTop: 14 }}>
          {trips.map((t) => {
            const x = parseDay(t.entry)!;
            const y = parseDay(t.exit)!;
            return (
              <Animated.View key={t.id} entering={FadeInDown.springify().damping(16)} exiting={FadeOutRight} layout={LinearTransition}>
                <View style={styles.trip}>
                  <Ionicons name="airplane" size={18} color={accent} />
                  <Text style={styles.tripText}>
                    {t.entry} → {t.exit}
                  </Text>
                  <Text style={styles.tripDays}>{y - x + 1} d</Text>
                  <PressableScale onPress={() => removeTrip(t.id)} scaleTo={0.8} accessibilityLabel="Remove trip">
                    <Ionicons name="close-circle" size={22} color={colors.faint} />
                  </PressableScale>
                </View>
              </Animated.View>
            );
          })}
        </View>
      )}

      <Card style={{ marginTop: 18 }}>
        <Text style={styles.cardTitle}>Days used</Text>
        <DateField label="As of date" value={asOf} onChange={setAsOf} accent={accent} invalid={asOf.length === 10 && asOfDay === null} />
        {used !== null && remaining !== null ? (
          <Animated.View entering={FadeInDown} key={`${used}-${asOf}`} style={{ marginTop: 18 }}>
            <View style={styles.big}>
              <Text style={[styles.bigNum, { color: remaining === 0 ? '#FF6B8B' : '#34D4A0' }]}>{remaining}</Text>
              <Text style={styles.bigLabel}>days remaining</Text>
            </View>
            <Meter used={used} />
            <Text style={styles.meterText}>
              {used} of {LIMIT} days used in the last {WINDOW} days
            </Text>
            {free !== null && free > (asOfDay ?? 0) && (
              <Text style={[styles.meterText, { color: '#FFB547', marginTop: 8 }]}>You can re-enter from {fmtDay(free)}.</Text>
            )}
          </Animated.View>
        ) : null}
      </Card>

      <Card style={{ marginTop: 14 }}>
        <Text style={styles.cardTitle}>Plan a new trip</Text>
        <DateField label="Planned entry date" value={plan} onChange={setPlan} accent={accent} invalid={plan.length === 10 && planDay === null} />
        {planned && (
          <Animated.View entering={FadeInDown} key={plan + trips.length} style={{ marginTop: 16 }}>
            {planned.days > 0 ? (
              <>
                <Text style={styles.planNum}>
                  Up to <Text style={{ color: accent }}>{planned.days}</Text> days
                </Text>
                <Text style={styles.meterText}>Latest exit date: {fmtDay(planned.lastDay!)}</Text>
              </>
            ) : (
              <Text style={[styles.planNum, { color: '#FF6B8B' }]}>No days available on that date</Text>
            )}
          </Animated.View>
        )}
      </Card>
      <Disclaimer text="The day count follows the Schengen short-stay rule (entry and exit days count as full days). Other regions have different limits; official border records decide, so keep your stamps and tickets." />
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardTitle: { color: colors.text, fontSize: 17, fontWeight: '800', marginBottom: 14 },
  dates: { flexDirection: 'row', gap: 12 },
  error: { color: '#FF6B8B', fontSize: 13, marginTop: 10, marginLeft: 4 },
  button: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, marginTop: 16 },
  buttonText: { color: '#0B1020', fontSize: 16, fontWeight: '800' },
  trip: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  tripText: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '600' },
  tripDays: { color: colors.muted, fontSize: 13, fontWeight: '800' },
  big: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginBottom: 12 },
  bigNum: { fontSize: 56, fontWeight: '800', letterSpacing: -2 },
  bigLabel: { color: colors.muted, fontSize: 16, fontWeight: '700' },
  track: { height: 12, borderRadius: 6, backgroundColor: colors.surfaceStrong, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 6 },
  meterText: { color: colors.muted, fontSize: 13.5, marginTop: 10 },
  planNum: { color: colors.text, fontSize: 24, fontWeight: '800' },
});
