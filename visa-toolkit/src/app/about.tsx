import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { accents, colors } from '@/theme';

const BLOCKS = [
  { icon: 'shield-checkmark', title: 'Privacy first', body: 'Visara has no accounts, no ads and no trackers. Your passport choice, checklist progress and trips are stored only on your device.' },
  { icon: 'alert-circle', title: 'Guidance, not legal advice', body: 'Entry rules change without notice and depend on your personal circumstances. Visara is an informational tool — always confirm with the official embassy, consulate or government portal and your airline before travelling.' },
  { icon: 'library', title: 'About the data', body: 'Requirements, fees and processing times are indicative and kept in one editable data layer, so they can be updated or connected to a live API. Items flagged “double-check” are policies that have been changing recently.' },
] as const;

export default function About() {
  return (
    <Screen title="About Visara" subtitle="Version 1.0.0" accent={accents.visa} icon="information-circle">
      {BLOCKS.map((b, i) => (
        <Animated.View key={b.title} entering={FadeInDown.delay(100 + i * 100).springify().damping(16)} style={{ marginBottom: 12 }}>
          <Card>
            <View style={styles.row}>
              <Ionicons name={b.icon} size={22} color={accents.visa} />
              <Text style={styles.title}>{b.title}</Text>
            </View>
            <Text style={styles.body}>{b.body}</Text>
          </Card>
        </Animated.View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  title: { color: colors.text, fontSize: 17, fontWeight: '800' },
  body: { color: colors.muted, fontSize: 14.5, lineHeight: 22 },
});
