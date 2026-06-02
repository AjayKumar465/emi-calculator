import { useEffect } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { fonts, fontSizes } from '../../theme';

interface AnimatedValueProps {
  value: string;
  style?: StyleProp<TextStyle>;
}

export function AnimatedValue({ value, style }: AnimatedValueProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = 0.96;
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 180,
    });
  }, [scale, value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Text style={[{ fontFamily: fonts.monoBold, fontSize: fontSizes.lg }, style, animatedStyle]}>
      {value}
    </Animated.Text>
  );
}
