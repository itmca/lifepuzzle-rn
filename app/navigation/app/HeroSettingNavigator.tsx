import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HeroSettingPage from '../../pages/HeroPages/HeroSetting/HeroSettingPage';
import HeroRegisterPage from '../../pages/HeroPages/HeroRegister/HeroRegisterPage';
import HeroModificationPage from '../../pages/HeroPages/HeroModification/HeroModificationPage';
import HeroProfileSelectorPage from '../../pages/HeroPages/HeroProfileSelector/HeroProfileSelectorPage.tsx';
import WritingHeaderRight from '../../components/ui/navigation/header/WritingHeaderRight';

import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import { useNavigation } from '@react-navigation/native';
import { useHeroStore } from '../../stores/hero.store';
import { useSelectionStore } from '../../stores/selection.store';
import { HeroType } from '../../types/core/hero.type';
import HeroSettingRightHeader from '../../components/ui/navigation/header/HeroSettingRightHeader.tsx';
import { TopBar } from '../../components/ui/navigation/TopBar';

export type HeroSettingParamList = {
  HeroSetting: { shareKey?: string } | undefined;
  HeroRegister: undefined;
  HeroModification: { heroNo: number };
  HeroSelectingPhoto: undefined;
  HeroShare: { hero: HeroType };
};

const Stack = createNativeStackNavigator<HeroSettingParamList>();

const HeroSettingNavigator = (): React.ReactElement => {
  // 글로벌 상태 관리 (Zustand)
  const resetWritingHero = useHeroStore(state => state.resetWritingHero);
  const writingHero = useHeroStore(state => state.writingHero);
  const setWritingHero = useHeroStore(state => state.setWritingHero);
  const selectedHeroPhoto = useSelectionStore(state => state.selectedHeroPhoto);
  const resetSelectedHeroPhoto = useSelectionStore(
    state => state.resetSelectedHeroPhoto,
  );

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      initialRouteName="HeroSetting"
      screenOptions={{ headerShadowVisible: false, headerTitleAlign: 'center' }}
    >
      <Stack.Screen
        name="HeroSetting"
        component={HeroSettingPage}
        options={{
          header: () => (
            <TopBar title={'주인공 관리'} right={<HeroSettingRightHeader />} />
          ),
        }}
      />
      <Stack.Screen
        name="HeroRegister"
        component={HeroRegisterPage}
        options={{
          header: () => (
            <TopBar
              customGoBackAction={() => {
                resetWritingHero();
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              title={'주인공 추가'}
            />
          ),
        }}
      />
      <Stack.Screen
        name="HeroModification"
        component={HeroModificationPage}
        options={{
          header: () => (
            <TopBar
              customGoBackAction={() => {
                resetWritingHero();
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              title={'주인공 수정'}
            />
          ),
        }}
      />
      <Stack.Screen
        name="HeroSelectingPhoto"
        component={HeroProfileSelectorPage}
        options={{
          header: () => (
            <TopBar
              customGoBackAction={() => {
                resetSelectedHeroPhoto();
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              title={'주인공 사진 선택'}
              right={
                <WritingHeaderRight
                  text="확인"
                  customAction={() => {
                    setWritingHero({
                      ...writingHero,
                      imageUrl: selectedHeroPhoto,
                      isProfileImageUpdate: true,
                    });
                    resetSelectedHeroPhoto();
                    navigation.goBack();
                  }}
                />
              }
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default HeroSettingNavigator;
