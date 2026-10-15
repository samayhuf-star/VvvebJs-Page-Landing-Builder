import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppBackground } from './AppBackground';
import { PressableScale } from './PressableScale';
import { colors } from '@/theme';

type Props = { title: string; subtitle?: string; accent: string; icon: keyof typeof Ionicons.glyphMap; children: React.ReactNode };

export function Screen({ title, subtitle, accent, icon, children }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={styles.root}>
      <AppBackground accent={accent} />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInLeft.duration(350)}>
          <PressableScale onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} style={styles.back} accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </PressableScale>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(80).springify().damping(16)} style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: accent + '26', borderColor: accent + '66' }]}>
            <Ionicons name={icon} size={26} color={accent} />
          </View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </Animated.View>
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceStrong, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  header: { marginTop: 20, marginBottom: 22 },
  iconWrap: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginBottom: 14 },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 21, marginTop: 6 },
});
