import { StyleSheet } from 'react-native';

export const colors = {
  background: '#0B100A',
  surface: '#181F15',
  raised: '#20291B',
  border: '#303B29',
  green: '#76E62E',
  lime: '#55D000',
  text: '#F5F7F1',
  muted: '#929D89',
  dim: '#65705E',
  danger: '#D58B75',
};
export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: 20,
    gap: 24,
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1,
  },
  heading: { fontSize: 23, color: colors.text, letterSpacing: -0.5 },
  body: { fontSize: 14, lineHeight: 23, color: colors.muted },
  label: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    color: colors.green,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { height: 1, backgroundColor: colors.border },
});
