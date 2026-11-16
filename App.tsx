import { MotionProvider } from './src/components/Motion';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/storage/AppProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { OnboardingScreen, SplashScreen } from './src/screens/LaunchScreens';
import { Button } from './src/components/UI';
import { colors, styles } from './src/theme';
function AppContent() {
  const [launched, setLaunched] = useState(false);
  const { ready, error, onboarded, retry } = useApp();
  const finish = useCallback(() => setLaunched(true), []);
  if (!launched) {
    return <SplashScreen onFinish={finish} />;
  }
  if (error) {
    return (
      <View
        style={[
          styles.screen,
          { justifyContent: 'center', padding: 30, gap: 24 },
        ]}
      >
        <Text style={styles.body}>{error}</Text>
        <Button title="Retry" onPress={() => void retry()} />
      </View>
    );
  }
  if (!ready) {
    return (
      <View style={[styles.screen, { justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.green} />
      </View>
    );
  }
  return onboarded ? <AppNavigator /> : <OnboardingScreen />;
}
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <MotionProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </MotionProvider>
    </SafeAreaProvider>
  );
}
