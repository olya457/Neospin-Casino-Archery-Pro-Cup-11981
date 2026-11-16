import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';

export default function Gradient({
  children,
  style,
  colors,
  start,
  end,
  locations,
  useAngle,
  angleCenter,
  angle,
  ...viewProps
}: LinearGradientProps) {
  return (
    <View {...viewProps} style={[{ overflow: 'hidden' }, style]}>
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        locations={locations}
        useAngle={useAngle}
        angleCenter={angleCenter}
        angle={angle}
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}
