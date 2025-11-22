import type { CompositeScreenProps } from '@react-navigation/native';
import { RootStackParamList } from './RootNavigator';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

// Import ParamList types from navigators
import { AuthParamList } from './auth/AuthNavigator';
import { LoginRegisterParamList } from './auth/LoginRegisterNavigator';
import { PolicyParamList } from './auth/PolicyNavigator';
import { AppParamList } from './app/AppNavigator';
import { HeroSettingParamList } from './app/HeroSettingNavigator';
import { StoryWritingParamList } from './app/StoryWritingNavigator';
import { StoryViewParamList } from './app/StoryViewNavigator';
import { AiPhotoParamList } from './app/AiPhotoNavigator';
import { AccountSettingParamList } from './app/AccountSettingNavigator';

// =============================================================================
// Root Navigator Types
// =============================================================================

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type BasicNavigationProps =
  NativeStackNavigationProp<RootStackParamList>;

// =============================================================================
// Auth Navigator Types (Unauthenticated flows)
// =============================================================================

export type AuthScreenProps<T extends keyof AuthParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type AuthNavigationProps<T extends keyof AuthParamList> =
  AuthScreenProps<T>['navigation'];

export type AuthRouteProps<T extends keyof AuthParamList> =
  AuthScreenProps<T>['route'];

// LoginRegister Navigator
export type LoginRegisterScreenProps<T extends keyof LoginRegisterParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<LoginRegisterParamList, T>,
    AuthScreenProps<keyof AuthParamList>
  >;

export type LoginRegisterNavigationProps<
  T extends keyof LoginRegisterParamList,
> = LoginRegisterScreenProps<T>['navigation'];

export type LoginRegisterRouteProps<T extends keyof LoginRegisterParamList> =
  LoginRegisterScreenProps<T>['route'];

// Policy Navigator
export type PolicyScreenProps<T extends keyof PolicyParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<PolicyParamList, T>,
    AuthScreenProps<keyof AuthParamList>
  >;

export type PolicyNavigationProps<T extends keyof PolicyParamList> =
  PolicyScreenProps<T>['navigation'];

export type PolicyRouteProps<T extends keyof PolicyParamList> =
  PolicyScreenProps<T>['route'];

// =============================================================================
// App Navigator Types (Authenticated flows)
// =============================================================================

export type AppScreenProps<T extends keyof AppParamList> = CompositeScreenProps<
  NativeStackScreenProps<AppParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type AppNavigationProps<T extends keyof AppParamList> =
  AppScreenProps<T>['navigation'];

export type AppRouteProps<T extends keyof AppParamList> =
  AppScreenProps<T>['route'];

// HeroSetting Navigator
export type HeroSettingScreenProps<T extends keyof HeroSettingParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HeroSettingParamList, T>,
    AppScreenProps<keyof AppParamList>
  >;

export type HeroSettingNavigationProps<T extends keyof HeroSettingParamList> =
  HeroSettingScreenProps<T>['navigation'];

export type HeroSettingRouteProps<T extends keyof HeroSettingParamList> =
  HeroSettingScreenProps<T>['route'];

// StoryWriting Navigator
export type StoryWritingScreenProps<T extends keyof StoryWritingParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<StoryWritingParamList, T>,
    AppScreenProps<keyof AppParamList>
  >;

export type StoryWritingNavigationProps<T extends keyof StoryWritingParamList> =
  StoryWritingScreenProps<T>['navigation'];

export type StoryWritingRouteProps<T extends keyof StoryWritingParamList> =
  StoryWritingScreenProps<T>['route'];

// StoryView Navigator
export type StoryViewScreenProps<T extends keyof StoryViewParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<StoryViewParamList, T>,
    AppScreenProps<keyof AppParamList>
  >;

export type StoryViewNavigationProps<T extends keyof StoryViewParamList> =
  StoryViewScreenProps<T>['navigation'];

export type StoryViewRouteProps<T extends keyof StoryViewParamList> =
  StoryViewScreenProps<T>['route'];

// AiPhoto Navigator
export type AiPhotoScreenProps<T extends keyof AiPhotoParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AiPhotoParamList, T>,
    AppScreenProps<keyof AppParamList>
  >;

export type AiPhotoNavigationProps<T extends keyof AiPhotoParamList> =
  AiPhotoScreenProps<T>['navigation'];

export type AiPhotoRouteProps<T extends keyof AiPhotoParamList> =
  AiPhotoScreenProps<T>['route'];

// AccountSetting Navigator
export type AccountSettingScreenProps<T extends keyof AccountSettingParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AccountSettingParamList, T>,
    AppScreenProps<keyof AppParamList>
  >;

export type AccountSettingNavigationProps<
  T extends keyof AccountSettingParamList,
> = AccountSettingScreenProps<T>['navigation'];

export type AccountSettingRouteProps<T extends keyof AccountSettingParamList> =
  AccountSettingScreenProps<T>['route'];

// =============================================================================
// Global Navigation Type Declaration
// =============================================================================

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
