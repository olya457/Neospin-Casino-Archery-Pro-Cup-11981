import React, { createContext, useContext } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { layoutFor } from '../utils/layout';

const WidthContext = createContext<number | null>(null);
export function useLayout() {
  const { width, height, fontScale } = useWindowDimensions();
  const containerWidth = useContext(WidthContext);
  return layoutFor(containerWidth ?? width, height, fontScale);
}
export const LayoutProvider = WidthContext.Provider;
export function AdaptiveGrid({ children }: { children: React.ReactNode }) {
  const { columns } = useLayout();
  const items = React.Children.toArray(children);
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
      {items.map((child, index) => (
        <View
          key={React.isValidElement(child) ? child.key ?? index : index}
          style={{
            width: columns === 2 ? '47.8%' : '100%',
            flexGrow: 1,
            maxWidth: columns === 2 ? '49%' : '100%',
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}
