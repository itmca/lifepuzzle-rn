import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HeroSettingPage from '../../pages/HeroPages/HeroSetting/HeroSettingPage';
import HeroRegisterPage from '../../pages/HeroPages/HeroRegister/HeroRegisterPage';
import HeroModificationPage from '../../pages/HeroPages/HeroModification/HeroModificationPage';
import HeroProfileSelectorPage from '../../pages/HeroPages/HeroProfileSelector/HeroProfileSelectorPage.tsx';
import WritingHeaderRight from '../../components/ui/navigation/header/WritingHeaderRight';
import { useHeroStore } from '../../stores/hero.store';
import { useSelectionStore } from '../../stores/selection.store';
import { HeroType } from '../../types/core/hero.type';
import HeroSettingRightHeader from '../../components/ui/navigation/header/HeroSettingRightHeader.tsx';
import { TopBar } from '../../components/ui/navigation/TopBar';
import { HERO_SETTING_SCREENS } from '../screens.constant';

export type HeroSettingParamList = {
  [HERO_SETTING_SCREENS.HERO_SETTING]: { shareKey?: string } | undefined;
  [HERO_SETTING_SCREENS.HERO_REGISTER]: undefined;
  [HERO_SETTING_SCREENS.HERO_MODIFICATION]: { heroNo: number };
  [HERO_SETTING_SCREENS.HERO_PROFILE_SELECTOR]: undefined;
  [HERO_SETTING_SCREENS.HERO_SHARE]: { hero: HeroType };
};

const Stack = createNativeStackNavigator<HeroSettingParamList>();

const HeroSettingNavigator = (): React.ReactElement => {
  // 글로벌 상태 관리 (Zustand) - 액션 함수만 구독
  const resetWritingHero = useHeroStore(state => state.resetWritingHero);
  const setWritingHero = useHeroStore(state => state.setWritingHero);
  const resetSelectedHeroPhoto = useSelectionStore(
    state => state.resetSelectedHeroPhoto,
  );

  return (
    <Stack.Navigator
      initialRouteName={HERO_SETTING_SCREENS.HERO_SETTING}
      screenOptions={{ headerShadowVisible: false, headerTitleAlign: 'center' }}
    >
      <Stack.Screen
        name={HERO_SETTING_SCREENS.HERO_SETTING}
        component={HeroSettingPage}
        options={{
          header: () => (
            <TopBar title={'주인공 관리'} right={<HeroSettingRightHeader />} />
          ),
        }}
      />
      <Stack.Screen
        name={HERO_SETTING_SCREENS.HERO_REGISTER}
        component={HeroRegisterPage}
        options={({ navigation }) => ({
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
        })}
      />
      <Stack.Screen
        name={HERO_SETTING_SCREENS.HERO_MODIFICATION}
        component={HeroModificationPage}
        options={({ navigation }) => ({
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
        })}
      />
      <Stack.Screen
        name={HERO_SETTING_SCREENS.HERO_PROFILE_SELECTOR}
        component={HeroProfileSelectorPage}
        options={({ navigation }) => ({
          header: () => {
            // 헤더 렌더링 시점에 값 읽기
            const writingHero = useHeroStore.getState().writingHero;
            const selectedHeroPhoto =
              useSelectionStore.getState().selectedHeroPhoto;
            return (
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
                        modifiedImage: selectedHeroPhoto,
                        isProfileImageUpdate: true,
                      });
                      resetSelectedHeroPhoto();
                      if (navigation.canGoBack()) {
                        navigation.goBack();
                      }
                    }}
                  />
                }
              />
            );
          },
        })}
      />
    </Stack.Navigator>
  );
};

export default HeroSettingNavigator;
