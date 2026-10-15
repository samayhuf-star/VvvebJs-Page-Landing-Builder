import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { PressableScale } from './PressableScale';
import { colors, radius } from '@/theme';

export type Option = { id: string; label: string; flag?: string; sub?: string };

type Props = { label: string; placeholder: string; options: Option[]; value: string | null; onChange: (id: string) => void; accent: string; searchable?: boolean };

export function SelectField({ label, placeholder, options, value, onChange, accent, searchable = true }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const selected = options.find((o) => o.id === value);
  const filtered = useMemo(() => options.filter((o) => o.label.toLowerCase().includes(q.trim().toLowerCase())), [options, q]);
  const close = () => {
    setOpen(false);
    setQ('');
  };

  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <PressableScale onPress={() => setOpen(true)} scaleTo={0.985} style={[styles.field, selected && { borderColor: accent + '99' }]} accessibilityRole="button" accessibilityLabel={`${label}: ${selected?.label ?? placeholder}`}>
        <View style={styles.row}>
          <Text style={styles.flag}>{selected?.flag ?? '🌍'}</Text>
          <Text style={[styles.value, !selected && { color: colors.faint }]} numberOfLines={1}>
            {selected?.label ?? placeholder}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.muted} />
        </View>
      </PressableScale>

      <Modal visible={open} transparent animationType="none" onRequestClose={close} statusBarTranslucent>
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(180)} style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        </Animated.View>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetWrap} pointerEvents="box-none">
          <Animated.View entering={SlideInDown.springify().damping(18)} exiting={SlideOutDown.duration(200)} style={styles.sheet}>
            <View style={styles.grabber} />
            <Text style={styles.sheetTitle}>{label}</Text>
            {searchable && (
              <View style={styles.search}>
                <Ionicons name="search" size={18} color={colors.muted} />
                <TextInput value={q} onChangeText={setQ} placeholder="Search…" placeholderTextColor={colors.faint} style={styles.searchInput} autoCorrect={false} />
              </View>
            )}
            <FlatList
              data={filtered}
              keyExtractor={(o) => o.id}
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 420 }}
              ListEmptyComponent={<Text style={{ color: colors.muted, textAlign: 'center', padding: 24 }}>No matches</Text>}
              renderItem={({ item }) => {
                const active = item.id === value;
                return (
                  <PressableScale
                    scaleTo={0.98}
                    onPress={() => {
                      onChange(item.id);
                      close();
                    }}
                    style={[styles.option, active && { backgroundColor: accent + '22' }]}>
                    <View style={styles.row}>
                      <Text style={styles.flag}>{item.flag ?? '🌍'}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.optionText}>{item.label}</Text>
                        {item.sub ? <Text style={styles.optionSub}>{item.sub}</Text> : null}
                      </View>
                      {active && <Ionicons name="checkmark-circle" size={20} color={accent} />}
                    </View>
                  </PressableScale>
                );
              }}
            />
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },
  field: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 15 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flag: { fontSize: 24 },
  value: { flex: 1, color: colors.text, fontSize: 17, fontWeight: '600' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(3,6,18,0.7)' },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#161D3F', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 18, paddingBottom: 34, borderWidth: 1, borderColor: colors.border, width: '100%', maxWidth: 640, alignSelf: 'center' },
  grabber: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.border, marginBottom: 14 },
  sheetTitle: { color: colors.text, fontSize: 20, fontWeight: '800', marginBottom: 12 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: 14, paddingHorizontal: 14, marginBottom: 10 },
  searchInput: { flex: 1, color: colors.text, fontSize: 16, paddingVertical: 12 },
  option: { paddingVertical: 12, paddingHorizontal: 12, borderRadius: 14 },
  optionText: { color: colors.text, fontSize: 16, fontWeight: '600' },
  optionSub: { color: colors.muted, fontSize: 13, marginTop: 2 },
});
