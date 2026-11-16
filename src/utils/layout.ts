export function layoutFor(width: number, height: number, fontScale = 1) {
  const largeText = fontScale > 1.35;
  return {
    width,
    height,
    compact: width < 360 || height < 600,
    wide: width >= 640 && !largeText,
    columns: width >= 640 && !largeText ? 2 : 1,
  };
}
