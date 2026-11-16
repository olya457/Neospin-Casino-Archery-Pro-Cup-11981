import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

export function Photo({
  source,
  ratio,
}: {
  source: ImageSourcePropType;
  ratio: number;
}) {
  return (
    <View style={{ width: '100%', aspectRatio: ratio, overflow: 'hidden' }}>
      <Image
        source={source}
        resizeMode="cover"
        style={[
          StyleSheet.absoluteFill,
          { width: '100%', height: '100%' },
        ]}
      />
    </View>
  );
}
