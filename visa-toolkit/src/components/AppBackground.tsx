import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { colors } from '@/theme';

function Orb({ color, size, top, left, delay, dx, dy }: { color: string; size: number; top: number | string; left: number | string; delay: number; dx: number; dy: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 7000 + delay, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [delay, t]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: t.value * dx }, { translateY: t.value * dy }, { scale: 1 + t.value * 0.15 }] }));
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', top: top as number, left: left as number, width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      {[1, 0.78, 0.56, 0.34].map((f) => (
        <View key={f} style={{ position: 'absolute', width: size * f, height: size * f, borderRadius: (size * f) / 2, backgroundColor: color, opacity: 0.07 }} />
      ))}
    </Animated.View>
  );
}

/** Dark gradient with slowly drifting colour orbs. */
export function AppBackground({ accent = '#6C8CFF' }: { accent?: string }) {
  return (
    <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]} pointerEvents="none">
      <LinearGradient colors={[colors.bg, colors.bg2, colors.bg]} style={StyleSheet.absoluteFill} />
      <Orb color={accent} size={320} top={-110} left={-90} delay={0} dx={40} dy={30} />
      <Orb color="#B07CFF" size={260} top={380} left={190} delay={1200} dx={-50} dy={40} />
      <Orb color="#34D4A0" size={200} top={720} left={-70} delay={2400} dx={40} dy={-30} />
    </View>
  );
}
