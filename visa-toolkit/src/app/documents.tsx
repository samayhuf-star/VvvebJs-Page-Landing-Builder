import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Chip } from '@/components/Chip';
import { Disclaimer } from '@/components/Disclaimer';
import { PressableScale } from '@/components/PressableScale';
import { Screen } from '@/components/Screen';
import { SelectField } from '@/components/SelectField';
import { DESTINATIONS } from '@/data/countries';
import { docsFor, Purpose, PURPOSES } from '@/data/documents';
import { usePassport } from '@/lib/passport';
import { load, save } from '@/lib/storage';
import { STATUS_META, visaFor } from '@/lib/visa';
import { accents, colors, radius } from '@/theme';

const KEY = 'visara:docs:v1';

function CheckBox({ checked, color }: { checked: boolean; color: string }) {
  const s = useSharedValue(checked ? 1 : 0);
  useEffect(() => {
    s.value = withSpring(checked ? 1 : 0, { damping: 11, stiffness: 220 });
  }, [checked, s]);
  const box = useAnimatedStyle(() => ({ backgroundColor: checked ? color : 'transparent', transform: [{ scale: 1 + s.value * 0.12 * (1 - s.value) * 4 }] }));
  const tick = useAnimatedStyle(() => ({ opacity: s.value, transform: [{ scale: s.value }] }));
  return (
    <Animated.View style={[styles.box, { borderColor: checked ? color : colors.faint }, box]}>
      <Animated.View style={tick}>
        <Ionicons name="checkmark" size={16} color="#0B1020" />
      </Animated.View>
    </Animated.View>
  );
}

function Progress({ pct, color }: { pct: number; color: string }) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withTiming(pct, { duration: 600 });
  }, [pct, w]);
  const style = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { backgroundColor: color }, style]} />
    </View>
  );
}

export default function Documents() {
  const { passport } = usePassport();
  const [dest, setDest] = useState<string | null>(null);
  const [purpose, setPurpose] = useState<Purpose>('tourist');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const accent = accents.docs;

  useEffect(() => {
    load<Record<string, boolean>>(KEY, {}).then(setChecked);
  }, []);

  const items = dest ? docsFor(dest, purpose) : [];
  const keyOf = (id: string) => `${dest}:${purpose}:${id}`;
  const done = items.filter((i) => checked[keyOf(i.id)]).length;
  const pct = items.length ? done / items.length : 0;
  const info = passport && dest ? visaFor(passport, dest) : null;

  const toggle = (id: string) => {
    const next = { ...checked, [keyOf(id)]: !checked[keyOf(id)] };
    setChecked(next);
    save(KEY, next);
  };
  const reset = () => {
    const next = { ...checked };
    items.forEach((i) => delete next[keyOf(i.id)]);
    setChecked(next);
    save(KEY, next);
  };

  return (
    <Screen title="Documents" subtitle="A tailored checklist for your application. Progress is saved on your device." accent={accent} icon="document-text">
      <SelectField label="Destination" placeholder="Select destination" accent={accent} value={dest} onChange={setDest} options={DESTINATIONS.map((d) => ({ id: d.id, label: d.name, flag: d.flag }))} />
      <Text style={styles.label}>Purpose of travel</Text>
      <View style={styles.chips}>
        {PURPOSES.map((p) => (
          <Chip key={p.id} label={p.label} active={purpose === p.id} onPress={() => setPurpose(p.id)} accent={accent} />
        ))}
      </View>

      {info && info.status !== 'required' && info.status !== 'evisa' && (
        <Animated.View entering={FadeInDown.springify()} style={[styles.banner, { borderColor: STATUS_META[info.status].color + '88' }]}>
          <Ionicons name={STATUS_META[info.status].icon as keyof typeof Ionicons.glyphMap} size={20} color={STATUS_META[info.status].color} />
          <Text style={styles.bannerText}>
            Your passport is <Text style={{ fontWeight: '800' }}>{STATUS_META[info.status].label.toLowerCase()}</Text> here — you may not need a visa application, but border officers can still ask for these documents.
          </Text>
        </Animated.View>
      )}

      {dest ? (
        <View style={{ marginTop: 10 }}>
          <View style={styles.progressHead}>
            <Text style={styles.progressText}>
              {done} of {items.length} ready
            </Text>
            <PressableScale onPress={reset} scaleTo={0.92}>
              <Text style={[styles.reset, { color: accent }]}>Reset</Text>
            </PressableScale>
          </View>
          <Progress pct={pct} color={accent} />
          {pct === 1 && (
            <Animated.Text entering={FadeInDown.springify()} style={[styles.allDone, { color: accent }]}>
              🎉 All set — you’re ready to apply!
            </Animated.Text>
          )}

          <View style={{ marginTop: 16 }}>
            {items.map((it, i) => {
              const on = !!checked[keyOf(it.id)];
              return (
                <Animated.View key={it.id} entering={FadeInDown.delay(i * 45).springify().damping(16)} layout={LinearTransition}>
                  <PressableScale onPress={() => toggle(it.id)} scaleTo={0.985} style={[styles.item, on && { borderColor: accent + '88', backgroundColor: accent + '12' }]} accessibilityRole="checkbox" accessibilityState={{ checked: on }}>
                    <CheckBox checked={on} color={accent} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.itemTitle, on && { textDecorationLine: 'line-through', opacity: 0.6 }]}>{it.title}</Text>
                      {it.hint ? <Text style={styles.itemHint}>{it.hint}</Text> : null}
                    </View>
                  </PressableScale>
                </Animated.View>
              );
            })}
          </View>
        </View>
      ) : (
        <Animated.View entering={FadeInDown.delay(150)} style={styles.empty}>
          <Ionicons name="folder-open" size={42} color={colors.faint} />
          <Text style={styles.emptyText}>Select a destination to build your checklist</Text>
        </Animated.View>
      )}
      <Disclaimer text="Requirements vary by embassy, nationality and personal circumstances. Use this as a starting point and check the official list." />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10, marginLeft: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  banner: { flexDirection: 'row', gap: 10, alignItems: 'center', padding: 14, borderRadius: radius.md, borderWidth: 1, backgroundColor: colors.surface, marginBottom: 6 },
  bannerText: { flex: 1, color: colors.text, fontSize: 13.5, lineHeight: 19 },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, marginHorizontal: 4 },
  progressText: { color: colors.text, fontWeight: '800', fontSize: 15 },
  reset: { fontWeight: '800', fontSize: 14 },
  track: { height: 10, borderRadius: 5, backgroundColor: colors.surfaceStrong, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5 },
  allDone: { textAlign: 'center', fontWeight: '800', fontSize: 16, marginTop: 14 },
  item: { flexDirection: 'row', gap: 14, alignItems: 'flex-start', padding: 14, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 10 },
  box: { width: 26, height: 26, borderRadius: 9, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  itemTitle: { color: colors.text, fontSize: 15.5, fontWeight: '700' },
  itemHint: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 3 },
  empty: { alignItems: 'center', gap: 10, paddingVertical: 36 },
  emptyText: { color: colors.faint, fontSize: 15 },
});
