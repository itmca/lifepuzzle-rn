import type { CompositeScreenProps } from '@react-navigation/native';
import { RootStackParamList } from './RootNavigator';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { HeroSettingParamList } from './app/HeroSettingNavigator';
import { PolicyParamList } from './auth/PolicyNavigator';

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type BasicNavigationProps =
  NativeStackNavigationProp<RootStackParamList>;

export type HeroSettingScreenProps<T extends keyof HeroSettingParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HeroSettingParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;
export type HeroSettingNavigationProps<T extends keyof HeroSettingParamList> =
  HeroSettingScreenProps<T>['navigation'];

export type HeroSettingRouteProps<T extends keyof HeroSettingParamList> =
  HeroSettingScreenProps<T>['route'];

export type PolicyScreenProps<T extends keyof PolicyParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<PolicyParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type PolicyRouteProps<T extends keyof PolicyParamList> =
  PolicyScreenProps<T>['route'];

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
