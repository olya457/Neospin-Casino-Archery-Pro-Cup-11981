import { Reveal } from '../components/Motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from '../components/Gradient';
import { WebView } from 'react-native-webview';
import { images } from '../data/images';
import { colors, styles as s } from '../theme';
import { Button, Footer } from '../components/UI';
import { useApp } from '../storage/AppProvider';

const animation = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"><style>html,body{margin:0;background:transparent;overflow:hidden}body{height:18px;display:flex;align-items:center}.track{width:100%;height:3px;background:#33452c;border-radius:8px;overflow:hidden}.fill{height:100%;width:0;background:linear-gradient(90deg,#83e535,#50d000);box-shadow:0 0 15px #7fff00;animation:loading 4s linear forwards}@keyframes loading{to{width:100%}}@media (prefers-reduced-motion:reduce){.fill{animation:none;width:100%}}</style></head><body><div class="track"><div class="fill"></div></div><script>if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){setTimeout(function(){window.ReactNativeWebView.postMessage('complete')},4000)}else{document.querySelector('.fill').addEventListener('animationend',function(){window.ReactNativeWebView.postMessage('complete')})}</script></body></html>`;
export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const { width, height } = useWindowDimensions();
  const shortScreen = height / width < 1.8;
  const finished = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finish = useCallback(() => {
    if (!finished.current) {
      finished.current = true;
      onFinish();
    }
  }, [onFinish]);
  const startFallback = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(finish, 4200);
  }, [finish]);
  useEffect(() => {
    timer.current = setTimeout(finish, 8000);
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [finish]);
  return (
    <ImageBackground source={images.splash} style={s.screen} resizeMode="cover">
      <LinearGradient
        colors={['#00000030', '#09130522', '#091305E8']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView edges={['top', 'bottom']} style={local.splashContent}>
        <Reveal style={[local.logoWrap, shortScreen && { paddingTop: 0 }]}>
          <Image
            source={images.logo}
            style={[
              local.logo,
              shortScreen && { transform: [{ translateY: 36 }] },
            ]}
            resizeMode="contain"
          />
        </Reveal>
        <View style={local.splashText}>
          <Text style={s.label}>The official app</Text>
          <Text style={local.brand}>Neospin Casino</Text>
          <Text style={local.brandGreen}>Archery Pro</Text>
          <Footer />
        </View>
        <View style={local.progress}>
          <WebView
            originWhitelist={['*']}
            source={{ html: animation }}
            onLoad={startFallback}
            onError={startFallback}
            onMessage={event => {
              if (event.nativeEvent.data === 'complete') {
                finish();
              }
            }}
            scrollEnabled={false}
            bounces={false}
            opaque={false}
            style={local.webview}
            javaScriptEnabled
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
const slides = [
  {
    image: images.entrance,
    label: 'The championship',
    title: 'Discover World-Class Archery',
    body: 'Explore professional championships, exciting competitions, and spectacular sporting events in one place.',
  },
  {
    image: images.arena,
    label: 'Your experience',
    title: 'Book Events in Seconds',
    body: 'Choose competitions and workshops, select your guests, and receive your QR ticket instantly.',
  },
  {
    image: images.festival,
    label: 'The festival',
    title: 'Navigate the Archery World',
    body: 'Discover arenas, explore archery technology, learn the rules, and find your way around the festival.',
  },
];
export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const { completeOnboarding } = useApp();
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const slide = slides[index];
  async function finish() {
    setBusy(true);
    try {
      await completeOnboarding();
    } catch {
      Alert.alert('Unable to save', 'Please try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={s.screen}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          maxWidth: 880,
          width: '100%',
          alignSelf: 'center',
        }}
        bounces={false}
      >
        <ImageBackground
          source={slide.image}
          style={{
            height: Math.max(
              180,
              height * (height < 650 ? 0.32 : compact ? 0.4 : 0.52),
            ),
          }}
        >
          <LinearGradient
            colors={['#00000018', '#00000000', colors.background]}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFill}
          />
          <SafeAreaView
            edges={['top', 'left', 'right']}
            style={local.onboardTop}
          >
            <Text style={local.wordmark}>
              WAM<Text style={{ color: colors.green }}>CUP</Text>
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={finish}
              disabled={busy}
              style={local.skip}
            >
              <Text style={{ color: '#D4DBCF', fontSize: 12 }}>Skip</Text>
            </Pressable>
          </SafeAreaView>
          <Text style={local.slideNumber}>0{index + 1}</Text>
        </ImageBackground>
        <Reveal
          key={index}
          style={[local.onboardBody, compact && { padding: 20, gap: 12 }]}
        >
          <Text style={s.label}>{slide.label}</Text>
          <Text
            style={[
              s.title,
              { fontWeight: '400' },
              compact && { fontSize: 26 },
            ]}
          >
            {slide.title}
          </Text>
          <Text style={[s.body, compact && { fontSize: 12, lineHeight: 20 }]}>
            {slide.body}
          </Text>
        </Reveal>
      </ScrollView>
      <SafeAreaView edges={['bottom', 'left', 'right']}>
        <View style={local.onboardBottom}>
          <View style={s.row}>
            {slides.map((_, i) => (
              <Pressable
                key={i}
                accessibilityRole="button"
                accessibilityLabel={`Introduction ${i + 1}`}
                onPress={() => setIndex(i)}
                hitSlop={12}
              >
                <View style={[local.dot, index === i && local.activeDot]} />
              </Pressable>
            ))}
          </View>
          <Button
            title={index === 2 ? 'Get Started   ›' : 'Next   ›'}
            loading={busy}
            onPress={() => (index === 2 ? void finish() : setIndex(index + 1))}
            compact
          />
        </View>
        <Footer />
      </SafeAreaView>
    </View>
  );
}
const local = StyleSheet.create({
  splashContent: {
    flex: 1,
    padding: 26,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logoWrap: {
    maxWidth: 480,
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    paddingTop: 80,
  },
  logo: { width: '100%', height: '100%', maxHeight: 400 },
  splashText: { alignItems: 'center', paddingTop: 24, gap: 5 },
  brand: {
    fontSize: 30,
    color: colors.text,
    textAlign: 'center',
    marginTop: 8,
  },
  brandGreen: { fontSize: 31, color: colors.green, fontWeight: '800' },
  progress: { height: 18, width: '80%', marginTop: 18, marginBottom: 12 },
  webview: { flex: 1, backgroundColor: 'transparent' },
  onboardTop: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordmark: { fontWeight: '900', fontSize: 16, color: colors.text },
  skip: {
    padding: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FFFFFF55',
  },
  slideNumber: {
    position: 'absolute',
    bottom: 18,
    right: 25,
    fontSize: 64,
    fontWeight: '800',
    color: '#FFFFFF18',
  },
  onboardBody: { padding: 26, gap: 16 },
  onboardBottom: {
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 26,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dot: { width: 6, height: 6, borderRadius: 5, backgroundColor: '#384530' },
  activeDot: { width: 26, backgroundColor: colors.green },
});
