import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type Props = Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle>; scaleTo?: number; haptic?: boolean };

export function PressableScale({ style, scaleTo = 0.96, haptic = true, onPressIn, onPressOut, onPress, children, ...rest }: Props) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Pressable
      {...rest}
      onPressIn={(e) => {
        scale.value = withSpring(scaleTo, { damping: 15, stiffness: 300 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: 12, stiffness: 220 });
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic && Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}>
      <Animated.View style={[style, anim]}>{children as React.ReactNode}</Animated.View>
    </Pressable>
  );
}
