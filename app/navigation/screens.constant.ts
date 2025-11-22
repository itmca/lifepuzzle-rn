/**
 * Navigation Screen Name Constants
 *
 * 모든 네비게이션 화면 이름을 상수로 관리합니다.
 * 문자열 오타 방지 및 자동완성 지원을 위해 사용합니다.
 */

// =============================================================================
// Root Navigator Screens
// =============================================================================
export const ROOT_SCREENS = {
  ONBOARDING: 'Onboarding',
  AUTH: 'Auth',
  APP: 'App',
} as const;

// =============================================================================
// Auth Navigator Screens
// =============================================================================
export const AUTH_SCREENS = {
  LOGIN_REGISTER_NAVIGATOR: 'LoginRegisterNavigator',
  POLICY_NAVIGATOR: 'PolicyNavigator',
} as const;

// LoginRegister Navigator Screens
export const LOGIN_REGISTER_SCREENS = {
  LOGIN_MAIN: 'LoginMain',
  LOGIN_OTHERS: 'LoginOthers',
  REGISTER: 'Register',
} as const;

// Policy Navigator Screens
export const POLICY_SCREENS = {
  SERVICE_POLICY: 'ServicePolicy',
  PRIVACY_POLICY: 'PrivacyPolicy',
} as const;

// =============================================================================
// App Navigator Screens
// =============================================================================
export const APP_SCREENS = {
  HOME: 'Home',
  STORY_VIEW_NAVIGATOR: 'StoryViewNavigator',
  AI_PHOTO_NAVIGATOR: 'AiPhotoNavigator',
  STORY_WRITING_NAVIGATOR: 'StoryWritingNavigator',
  HERO_SETTING_NAVIGATOR: 'HeroSettingNavigator',
  ACCOUNT_SETTING_NAVIGATOR: 'AccountSettingNavigator',
} as const;

// HeroSetting Navigator Screens
export const HERO_SETTING_SCREENS = {
  HERO_SETTING: 'HeroSetting',
  HERO_REGISTER: 'HeroRegister',
  HERO_MODIFICATION: 'HeroModification',
  HERO_SELECTING_PHOTO: 'HeroSelectingPhoto',
  HERO_SHARE: 'HeroShare',
} as const;

// StoryWriting Navigator Screens
export const STORY_WRITING_SCREENS = {
  STORY_WRITING_MAIN: 'StoryWritingMain',
  STORY_GALLERY_SELECTOR: 'StoryGallerySelector',
  FACEBOOK_GALLERY_SELECTOR: 'FacebookGallerySelector',
  GALLERY_DETAIL: 'GalleryDetail',
  GALLERY_DETAIL_FILTER: 'GalleryDetailFilter',
} as const;

// StoryView Navigator Screens
export const STORY_VIEW_SCREENS = {
  STORY_LIST: 'StoryList',
  STORY: 'Story',
  STORY_DETAIL_WITHOUT_LOGIN: 'StoryDetailWithoutLogin',
} as const;

// AiPhoto Navigator Screens
export const AI_PHOTO_SCREENS = {
  AI_PHOTO: 'AiPhoto',
  AI_PHOTO_WORK_HISTORY: 'AiPhotoWorkHistory',
} as const;

// AccountSetting Navigator Screens
export const ACCOUNT_SETTING_SCREENS = {
  ACCOUNT_MODIFICATION: 'AccountModification',
  ACCOUNT_SELECTING_PHOTO: 'AccountSelectingPhoto',
  ACCOUNT_PASSWORD_MODIFICATION: 'AccountPasswordModification',
} as const;
