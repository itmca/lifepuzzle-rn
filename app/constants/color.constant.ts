export const Color = {
  // Gray Scale
  GREY: '#F5F5F5',
  GREY_100: '#E6E6E6',
  GREY_200: '#D6D6D6',
  GREY_300: '#B3B3B3',
  GREY_400: '#999999',
  GREY_500: '#808080',
  GREY_600: '#666666',
  GREY_700: '#4D4D4D',
  GREY_800: '#333333',
  GREY_900: '#1A1A1A',

  // Main Color
  MAIN_LIGHT: '#A3D8FF',
  MAIN: '#58ABFF',
  MAIN_DARK: '#379BFF',

  // Sub Color
  SUB_CORAL: '#FF6F6F',
  SUB_TEAL: '#34CF91',

  // Status
  ERROR_100: '#FFEFEF',
  ERROR_300: '#EF5350',
  SUCCESS_300: '#059952',

  // Background
  BG_100: '#FFFFFF',
  BG_200: '#FCFCFC',

  // Black / White
  BLACK: '#111111',
  WHITE: '#FFFFFF',

  // Others
  YELLOW: '#FEE500',
  BLUE_LIGHT: '#2C4A9A',
  TRANSPARENT: 'transparent',

  AI_500: '#9A53F7',
} as const;

export type ColorType = (typeof Color)[keyof typeof Color];
