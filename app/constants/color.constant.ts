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
  TRANSPARENT: 'transparent',
} as const;

export type ColorType = (typeof Color)[keyof typeof Color];

export const LegacyColor = {
  WHITE: '#ffffff',
  BLACK: '#000000',
  GRAY: '#EBEBEB',
  YELLOW: '#FFC657',
  DARK_BLUE: '#03ACEE',
  LIGHT_BLACK: '#333333',
  FONT_BLUE: '#00B7FF',
  FONT_DARK: '#555555',
  FONT_GRAY: '#B4B3B3',
  WHITE_GRAY: '#FCFCFC',
  LIGHT_GRAY: '#F6F6F6',
  MEDIUM_GRAY: '#C4C4C4',
  DARK_GRAY: '#999999',
  PRIMARY_DARK: '#02384E',
  PRIMARY_MEDIUM: '#0085FF',
  PRIMARY_LIGHT: '#32C5FF',
  SECONDARY_DARK: '#32C5FF',
  SECONDARY_MEDIUM: '#89DEFF',
  SECONDARY_LIGHT: '#D6F3FF',
  ALERT_DARK: '#FF3D00',
  ALERT_MEDIUM: '#FF6200',
  ALERT_LIGHT: '#FFE5D4',
};
