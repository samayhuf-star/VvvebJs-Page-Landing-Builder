import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { colors } from '@/theme';

/** Branded launch animation: logo springs in, plane sweeps across, then the overlay fades away. */
export function Intro() {
  const [visible, setVisible] = useState(true);
  const logo = useSharedValue(0);
  const plane = useSharedValue(-1);
  useEffect(() => {
    logo.value = withSpring(1, { damping: 9, stiffness: 120 });
    plane.value = withDelay(350, withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.cubic) }));
    const t = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(t);
  }, [logo, plane]);

  const logoStyle = useAnimatedStyle(() => ({ opacity: logo.value, transform: [{ scale: 0.4 + logo.value * 0.6 }, { rotate: `${(1 - logo.value) * -25}deg` }] }));
  const planeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: plane.value * 190 }, { translateY: plane.value * -26 }, { rotate: '-14deg' }],
    opacity: 1 - Math.abs(plane.value) * 0.9,
  }));
  if (!visible) return null;
  return (
    <Animated.View exiting={FadeOut.duration(450)} style={styles.overlay} pointerEvents="none">
      <LinearGradient colors={['#0B1020', '#1B1F4D', '#0B1020']} style={StyleSheet.absoluteFill} />
      <Animated.View style={[styles.logo, logoStyle]}>
        <LinearGradient colors={['#6C8CFF', '#B07CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logoGrad}>
          <Ionicons name="earth" size={54} color="#fff" />
        </LinearGradient>
      </Animated.View>
      <Animated.View style={[styles.planeWrap, planeStyle]}>
        <Ionicons name="airplane" size={30} color="#fff" />
      </Animated.View>
      <Animated.View entering={FadeIn.delay(500).duration(500)}>
        <Text style={styles.name}>Visara</Text>
        <Text style={styles.tag}>Your visa toolkit</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', zIndex: 99, backgroundColor: colors.bg },
  logo: { borderRadius: 34, shadowColor: '#6C8CFF', shadowOpacity: 0.6, shadowRadius: 30, shadowOffset: { width: 0, height: 10 } },
  logoGrad: { width: 112, height: 112, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },
  planeWrap: { position: 'absolute', top: '38%' },
  name: { color: colors.text, fontSize: 40, fontWeight: '800', letterSpacing: -1, textAlign: 'center', marginTop: 26 },
  tag: { color: colors.muted, fontSize: 16, textAlign: 'center', marginTop: 4 },
});
