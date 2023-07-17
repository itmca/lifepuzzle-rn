import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {RootStackParamList} from './RootNavigator';
import {HomeTabParamList} from './home-tab/HomeRootNavigator';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {HeroSettingParamList} from './no-tab/HeroSettingNavigator';
import {StoryViewParamList} from './no-tab/StoryViewNavigator';
import {StoryWritingParamList} from './no-tab/StoryWritingNavigator';
import {LoginRegisterParamList} from './no-tab/LoginRegisterNavigator';
import {AccountSettingParamList} from './no-tab/AccountSettingNavigator';
import {PolicyParamList} from './no-tab/PolicyNavigator';

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type BasicNavigationProps =
  NativeStackNavigationProp<RootStackParamList>;

export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type HomeTabNavigationProps<T extends keyof HomeTabParamList> =
  HomeTabScreenProps<T>['navigation'];

export type HomeTabRouteProps<T extends keyof HomeTabParamList> =
  HomeTabScreenProps<T>['route'];

export type StoryViewScreenProps<T extends keyof StoryViewParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<StoryViewParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type StoryViewNavigationProps<T extends keyof StoryViewParamList> =
  StoryViewScreenProps<T>['navigation'];

export type StoryViewRouteProps<T extends keyof StoryViewParamList> =
  StoryViewScreenProps<T>['route'];

export type StoryWritingScreenProps<T extends keyof StoryWritingParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<StoryWritingParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type StoryWritingNavigationProps<T extends keyof StoryWritingParamList> =
  StoryWritingScreenProps<T>['navigation'];

export type StoryWritingRouteProps<T extends keyof StoryWritingParamList> =
  StoryWritingScreenProps<T>['route'];

export type LoginRegisterScreenProps<T extends keyof LoginRegisterParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<LoginRegisterParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type LoginRegisterNavigationProps<
  T extends keyof LoginRegisterParamList,
> = LoginRegisterScreenProps<T>['navigation'];

export type LoginRegisterRouteProps<T extends keyof LoginRegisterParamList> =
  LoginRegisterScreenProps<T>['route'];

export type HeroSettingScreenProps<T extends keyof HeroSettingParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HeroSettingParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type HeroSettingNavigationProps<T extends keyof HeroSettingParamList> =
  HeroSettingScreenProps<T>['navigation'];

export type HeroSettingRouteProps<T extends keyof HeroSettingParamList> =
  HeroSettingScreenProps<T>['route'];

export type AccountSettingScreenProps<T extends keyof AccountSettingParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AccountSettingParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type AccountSettingNavigationProps<
  T extends keyof AccountSettingParamList,
> = AccountSettingScreenProps<T>['navigation'];

export type AccountSettingRouteProps<T extends keyof AccountSettingParamList> =
  AccountSettingScreenProps<T>['route'];

export type PolicyScreenProps<T extends keyof PolicyParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<PolicyParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type PolicyNavigationProps<T extends keyof PolicyParamList> =
  PolicyScreenProps<T>['navigation'];

export type PolicyRouteProps<T extends keyof PolicyParamList> =
  PolicyScreenProps<T>['route'];

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
