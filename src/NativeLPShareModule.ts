import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';

export interface SharedData {
  readonly type: string | null;
  readonly uri?: string;
  readonly uriList?: ReadonlyArray<string>;
}

export interface Spec extends TurboModule {
  sendSharedData(eventName: string, data: string): void;
  testMethod(): Promise<string>;
  getSharedData(): Promise<SharedData>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('LPShareModule');
