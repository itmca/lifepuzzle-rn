import * as React from 'react';
import { Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeroSettingPage } from '../../pages/HeroPages/HeroSetting/HeroSettingPage';
import { HeroRegisterStep1Page } from '../../pages/HeroPages/HeroRegister/HeroRegisterStep1Page';
import { HeroRegisterStep2Page } from '../../pages/HeroPages/HeroRegister/HeroRegisterStep2Page';
import { HeroRegisterStep3Page } from '../../pages/HeroPages/HeroRegister/HeroRegisterStep3Page';
import { HeroModificationPage } from '../../pages/HeroPages/HeroModification/HeroModificationPage';
import { HeroProfileSelectorPage } from '../../pages/HeroPages/HeroProfileSelector/HeroProfileSelectorPage.tsx';
import { WritingHeaderRight } from '../../components/ui/navigation/header/WritingHeaderRight';
import { useHeroStore } from '../../stores/hero.store';
import { HeroType } from '../../types/core/hero.type';
import { HeroSettingRightHeader } from '../../components/ui/navigation/header/HeroSettingRightHeader.tsx';
import { TopBar } from '../../components/ui/navigation/TopBar';
import { HERO_SETTING_SCREENS } from '../screens.constant';
import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import { useLogout } from '../../services/auth/logout.hook';
import { CustomAlert } from '../../components/ui/feedback/CustomAlert';
import { ContentContainer } from '../../components/ui/layout/ContentContainer';
import { BodyTextM } from '../../components/ui/base/TextBase';
import { Color } from '../../constants/color.constant';

export type HeroSettingParamList = {
  [HERO_SETTING_SCREENS.HERO_SETTING]: { shareKey?: string } | undefined;
  [HERO_SETTING_SCREENS.HERO_REGISTER_STEP1]:
    | { source?: 'hero-setting' | 'login' | 'hero-deleted' }
    | undefined;
  [HERO_SETTING_SCREENS.HERO_REGISTER_STEP2]:
    | { source?: 'hero-setting' | 'login' | 'hero-deleted' }
    | undefined;
  [HERO_SETTING_SCREENS.HERO_REGISTER_STEP3]:
    | { source?: 'hero-setting' | 'login' | 'hero-deleted' }
    | undefined;
  [HERO_SETTING_SCREENS.HERO_MODIFICATION]: { heroNo: number };
  [HERO_SETTING_SCREENS.HERO_PROFILE_SELECTOR]:
    | { selectedHeroPhoto?: PhotoIdentifier }
    | undefined;
  [HERO_SETTING_SCREENS.HERO_SHARE]: { hero: HeroType };
};

const Stack = createNativeStackNavigator<HeroSettingParamList>();

const HeroSettingNavigator = (): React.ReactElement => {
  // 글로벌 상태 관리 (Zustand) - 액션 함수만 구독
  const resetWritingHero = useHeroStore(state => state.resetWritingHero);
  const setWritingHero = useHeroStore(state => state.setWritingHero);

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
        name={HERO_SETTING_SCREENS.HERO_REGISTER_STEP1}
        component={HeroRegisterStep1Page}
        options={({ navigation, route }) => {
          const source = route.params?.source;
          const showLogoutButton =
            source === 'login' || source === 'hero-deleted';

          return {
            header: () => {
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const logout = useLogout();

              return (
                <TopBar
                  customGoBackAction={() => {
                    resetWritingHero();
                    if (navigation.canGoBack()) {
                      navigation.goBack();
                    }
                  }}
                  hideBackButton={showLogoutButton}
                  title={'주인공 추가 (1/3)'}
                  right={
                    showLogoutButton ? (
                      <Pressable
                        onPress={() => {
                          CustomAlert.actionAlert({
                            title: '로그아웃',
                            desc: '로그아웃 하시겠습니까?',
                            actionBtnText: '로그아웃',
                            action: logout,
                          });
                        }}
                      >
                        <ContentContainer paddingHorizontal={8}>
                          <BodyTextM color={Color.GREY_700}>로그아웃</BodyTextM>
                        </ContentContainer>
                      </Pressable>
                    ) : undefined
                  }
                />
              );
            },
          };
        }}
      />
      <Stack.Screen
        name={HERO_SETTING_SCREENS.HERO_REGISTER_STEP2}
        component={HeroRegisterStep2Page}
        options={{
          header: () => <TopBar title={'주인공 추가 (2/3)'} />,
        }}
      />
      <Stack.Screen
        name={HERO_SETTING_SCREENS.HERO_REGISTER_STEP3}
        component={HeroRegisterStep3Page}
        options={{
          header: () => <TopBar title={'주인공 추가 (3/3)'} />,
        }}
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
        options={({ navigation, route }) => ({
          header: () => {
            // 헤더 렌더링 시점에 값 읽기
            const writingHero = useHeroStore.getState().writingHero;
            const selectedHeroPhoto = route.params?.selectedHeroPhoto;
            return (
              <TopBar
                customGoBackAction={() => {
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
                        profileImageUpdate: true,
                      });
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

export { HeroSettingNavigator };
