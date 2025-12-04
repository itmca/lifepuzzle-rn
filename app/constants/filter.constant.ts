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
  exposure: (amount: number) => {
    const exp = Math.pow(2, amount);
    return [exp, 0, 0, 0, 0, 0, exp, 0, 0, 0, 0, 0, exp, 0, 0, 0, 0, 0, 1, 0];
  },
} as const;

export type FilterType = keyof typeof FILTER_EFFECTS;
export const FILTER_LABELS: Record<FilterType, string> = {
  original: '원본',
  light: '라이트',
  retro: '레트로',
  sepia: '세피아',
  grayscale: '흑백',
  exposure: '노출',
};

interface FilterSliderConfig {
  min: number;
  max: number;
  step: number;
  initial: number;
}
export const FILTER_SETTINGS: Record<
  FilterType,
  FilterSliderConfig | undefined
> = {
  exposure: { min: -1, max: 1, step: 0.01, initial: 0 },
  original: undefined,
  light: undefined,
  retro: undefined,
  sepia: undefined,
  grayscale: undefined,
};
