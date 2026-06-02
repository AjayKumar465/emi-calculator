import { ReactNode } from 'react';
import {
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface CalculatorScrollViewProps extends ScrollViewProps {
  children: ReactNode;
}

export function CalculatorScrollView({
  children,
  contentContainerStyle,
  style,
  ...rest
}: CalculatorScrollViewProps) {
  return (
    <ScrollView
      contentContainerStyle={contentContainerStyle}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
      removeClippedSubviews={Platform.OS === 'android'}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      style={[styles.scroll, style]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: Platform.select({
    web: {
      flex: 1,
      height: '100%',
      overflow: 'scroll',
      overscrollBehavior: 'contain',
      WebkitOverflowScrolling: 'touch',
    } as ViewStyle,
    default: {
      flex: 1,
    },
  }),
});
