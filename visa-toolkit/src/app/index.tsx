import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppBackground } from '@/components/AppBackground';
import { PressableScale } from '@/components/PressableScale';
import { SelectField } from '@/components/SelectField';
import { PASSPORTS } from '@/data/countries';
import { usePassport } from '@/lib/passport';
import { accents, colors, radius } from '@/theme';

const TOOLS = [
  { href: '/visa-check', title: 'Visa Check', desc: 'Do you need a visa? Find out in seconds.', icon: 'earth', color: accents.visa },
  { href: '/transit', title: 'Transit Visa', desc: 'Layover rules by airport and passport.', icon: 'swap-horizontal', color: accents.transit },
  { href: '/documents', title: 'Documents', desc: 'Smart checklist for your application.', icon: 'document-text', color: accents.docs },
  { href: '/fees', title: 'Fees & Timing', desc: 'Compare costs and processing times.', icon: 'cash', color: accents.fees },
  { href: '/stay', title: 'Stay Calculator', desc: '90/180-day rule tracker for Schengen.', icon: 'calendar', color: accents.stay },
] as const;

function FloatingPlane() {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [t]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: -8 + t.value * 16 }, { translateX: -6 + t.value * 12 }, { rotate: `${-12 + t.value * 8}deg` }] }));
  return (
    <Animated.View style={[styles.plane, style]}>
      <Ionicons name="airplane" size={40} color="#fff" />
    </Animated.View>
  );
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { passport, setPassport } = usePassport();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBackground />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.delay(2000).springify().damping(16)} style={styles.heroRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>VISARA</Text>
            <Text style={styles.hero}>Where to{'\n'}next?</Text>
          </View>
          <FloatingPlane />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(2100).springify().damping(16)}>
          <SelectField
            label="My passport"
            placeholder="Select your nationality"
            accent={accents.visa}
            value={passport}
            onChange={setPassport}
            options={PASSPORTS.map((p) => ({ id: p.code, label: p.name, flag: p.flag }))}
          />
        </Animated.View>

        <Text style={styles.section}>Tools</Text>
        {TOOLS.map((t, i) => (
          <Animated.View key={t.href} entering={FadeInDown.delay(2200 + i * 90).springify().damping(15)}>
            <PressableScale onPress={() => router.push(t.href)} style={styles.card} accessibilityRole="button" accessibilityLabel={`${t.title}. ${t.desc}`}>
              <LinearGradient colors={[t.color + '55', t.color + '12']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: radius.lg }]} />
              <View style={[styles.iconBox, { backgroundColor: t.color + '30', borderColor: t.color + '99' }]}>
                <Ionicons name={t.icon} size={26} color={t.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{t.title}</Text>
                <Text style={styles.cardDesc}>{t.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.muted} />
            </PressableScale>
          </Animated.View>
        ))}

        <Animated.View entering={FadeInDown.delay(2700)}>
          <PressableScale onPress={() => router.push('/about')} style={styles.aboutLink} scaleTo={0.97}>
            <Ionicons name="shield-checkmark" size={16} color={colors.muted} />
            <Text style={styles.aboutText}>About, data sources & privacy</Text>
          </PressableScale>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 26 },
  eyebrow: { color: accents.visa, fontWeight: '800', letterSpacing: 4, fontSize: 12, marginBottom: 8 },
  hero: { color: colors.text, fontSize: 44, lineHeight: 48, fontWeight: '800', letterSpacing: -1.5 },
  plane: { width: 84, height: 84, borderRadius: 28, backgroundColor: 'rgba(108,140,255,0.28)', borderWidth: 1, borderColor: 'rgba(108,140,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  section: { color: colors.muted, fontSize: 12, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 10, marginBottom: 12, marginLeft: 4 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, marginBottom: 12, overflow: 'hidden' },
  iconBox: { width: 54, height: 54, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  cardDesc: { color: colors.muted, fontSize: 13.5, marginTop: 3, lineHeight: 18 },
  aboutLink: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', padding: 16, marginTop: 8 },
  aboutText: { color: colors.muted, fontSize: 13, fontWeight: '600' },
});
