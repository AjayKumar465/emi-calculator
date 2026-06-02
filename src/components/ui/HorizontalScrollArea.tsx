import { ReactNode } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

interface HorizontalScrollAreaProps {
  children: ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export function HorizontalScrollArea({
  children,
  style,
  contentStyle,
}: HorizontalScrollAreaProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webScroll, style]}>
        <View style={[styles.webContent, contentStyle]}>{children}</View>
      </View>
    );
  }

  return (
    <ScrollView
      directionalLockEnabled
      horizontal
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      style={style}
      contentContainerStyle={contentStyle}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  webScroll: {
    maxWidth: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
    overscrollBehaviorX: 'contain',
    WebkitOverflowScrolling: 'touch',
  } as ViewStyle,
  webContent: {
    flexDirection: 'row',
  },
});
