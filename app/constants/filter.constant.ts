export const FILTER_EFFECTS = {
  original: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  light: [
    1.15, 0, 0, 0, 0.05, 0, 1.15, 0, 0, 0.05, 0, 0, 1.15, 0, 0.05, 0, 0, 0, 1,
    0,
  ], // 밝기 + 대비 + 채도 조합
  retro: [
    0.6, 0.3, 0.1, 0, 0, 0.2, 0.7, 0.1, 0, 0, 0.1, 0.2, 0.7, 0, 0, 0, 0, 0, 1,
    0,
  ],
  sepia: [
    0.393, 0.769, 0.189, 0, 0, 0.349, 0.686, 0.168, 0, 0, 0.272, 0.534, 0.131,
    0, 0, 0, 0, 0, 1, 0,
  ],
  grayscale: [
    0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114,
    0, 0, 0, 0, 0, 1, 0,
  ],
} as const;

export type FilterType = keyof typeof FILTER_EFFECTS;
export const FILTER_LABELS: Record<FilterType, string> = {
  original: '원본',
  light: '라이트',
  retro: '레트로',
  sepia: '세피아',
  grayscale: '흑백',
};
