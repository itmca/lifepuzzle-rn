export const FILTER_EFFECTS = {
  original: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  grayscale: [
    0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114,
    0, 0, 0, 0, 0, 1, 0,
  ],
  sepia: [
    0.393, 0.769, 0.189, 0, 0, 0.349, 0.686, 0.168, 0, 0, 0.272, 0.534, 0.131,
    0, 0, 0, 0, 0, 1, 0,
  ],
  invert: [-1, 0, 0, 0, 1, 0, -1, 0, 0, 1, 0, 0, -1, 0, 1, 0, 0, 0, 1, 0],

  brightness: (amount: number) => [
    1,
    0,
    0,
    0,
    amount,
    0,
    1,
    0,
    0,
    amount,
    0,
    0,
    1,
    0,
    amount,
    0,
    0,
    0,
    1,
    0,
  ],
  contrast: (amount: number) => {
    const t = 0.5 * (1 - amount);
    return [
      amount,
      0,
      0,
      0,
      t,
      0,
      amount,
      0,
      0,
      t,
      0,
      0,
      amount,
      0,
      t,
      0,
      0,
      0,
      1,
      0,
    ];
  },
  saturation: (amount: number) => {
    const r = 0.2126;
    const g = 0.7152;
    const b = 0.0722;
    const invSat = 1 - amount;
    const R = invSat * r;
    const G = invSat * g;
    const B = invSat * b;
    return [
      R + amount,
      G,
      B,
      0,
      0,
      R,
      G + amount,
      B,
      0,
      0,
      R,
      G,
      B + amount,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
    ];
  },
  exposure: (amount: number) => {
    const exp = Math.pow(2, amount);
    return [exp, 0, 0, 0, 0, 0, exp, 0, 0, 0, 0, 0, exp, 0, 0, 0, 0, 0, 1, 0];
  },
  softRetro: [
    0.6, 0.3, 0.1, 0, 0, 0.2, 0.7, 0.1, 0, 0, 0.1, 0.2, 0.7, 0, 0, 0, 0, 0, 1,
    0,
  ],
} as const;

export type FilterType = keyof typeof FILTER_EFFECTS | 'blur';
export const FILTER_LABELS: Record<FilterType, string> = {
  original: '원본',
  grayscale: '흑백',
  sepia: '세피아',
  invert: '반전',
  brightness: '밝기',
  contrast: '대비',
  saturation: '채도',
  exposure: '노출',
  softRetro: '레트로',
  blur: '블러',
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
  brightness: {min: -0.5, max: 0.5, step: 0.01, initial: 0},
  contrast: {min: 0, max: 2, step: 0.01, initial: 1},
  saturation: {min: 0, max: 2, step: 0.01, initial: 1},
  exposure: {min: -1, max: 1, step: 0.01, initial: 0},
  blur: {min: 0, max: 10, step: 0.1, initial: 0},
  original: undefined,
  grayscale: undefined,
  sepia: undefined,
  invert: undefined,
  softRetro: undefined,
};
