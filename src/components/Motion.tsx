import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Target } from 'lucide-react-native';
import { colors } from '../theme';

const MotionContext = createContext(true);
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(value => {
        if (mounted) {
          setReduced(value);
        }
      })
      .catch(() => undefined);
    const listener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduced,
    );
    return () => {
      mounted = false;
      listener.remove();
    };
  }, []);
  return (
    <MotionContext.Provider value={reduced}>{children}</MotionContext.Provider>
  );
}
export const useReducedMotion = () => useContext(MotionContext);
export function Reveal({
  children,
  active = true,
  style,
}: {
  children: React.ReactNode;
  active?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!active || reduced) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [active, reduced, progress]);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [14, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
export function PageMotion({ children }: { children: React.ReactNode }) {
  const focused = useIsFocused();
  return <Reveal active={focused}>{children}</Reveal>;
}
export function TargetPulse() {
  const focused = useIsFocused();
  const reduced = useReducedMotion();
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced || !focused) {
      pulse.setValue(0);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
          isInteraction: false,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
          isInteraction: false,
        }),
        Animated.delay(900),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [focused, reduced, pulse]);
  return (
    <View
      pointerEvents="none"
      accessible={false}
      style={{
        height: 36,
        width: 36,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          width: 30,
          height: 30,
          borderRadius: 15,
          borderWidth: 1,
          borderColor: colors.green,
          opacity: pulse.interpolate({
            inputRange: [0, 1],
            outputRange: [0.45, 0],
          }),
          transform: [
            {
              scale: pulse.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.4],
              }),
            },
          ],
        }}
      />
      <Target size={23} color={colors.green} strokeWidth={1.3} />
    </View>
  );
}
export function usePressMotion() {
  const reduced = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  return {
    scale,
    press: (down: boolean) => {
      scale.stopAnimation();
      if (reduced) {
        scale.setValue(1);
        return;
      }
      Animated.spring(scale, {
        toValue: down ? 0.97 : 1,
        speed: 30,
        bounciness: 4,
        useNativeDriver: true,
      }).start();
    },
  };
}
