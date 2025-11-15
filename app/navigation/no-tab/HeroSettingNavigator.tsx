import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HeroSettingPage from '../../pages/HeroPages/HeroSetting/HeroSettingPage';
import HeroRegisterPage from '../../pages/HeroPages/HeroRegister/HeroRegisterPage';
import HeroModificationPage from '../../pages/HeroPages/HeroModification/HeroModificationPage';
import HeroProfileSelectorPage from '../../pages/HeroPages/HeroProfileSelector/HeroProfileSelectorPage.tsx';
import WritingHeaderRight from '../../components/ui/navigation/header/WritingHeaderRight';
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil';
import {selectedHeroPhotoState} from '../../recoils/ui/selection.recoil';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {useNavigation} from '@react-navigation/native';
import {writingHeroState} from '../../recoils/content/hero-write.recoil';
import {HeroType} from '../../types/hero.type';
import HeroSettingRightHeader from '../../components/ui/navigation/header/HeroSettingRightHeader.tsx';
import {TopBar} from '../../components/ui/navigation/TopBar';

export type HeroSettingParamList = {
  HeroSetting: {shareKey?: string} | undefined;
  HeroRegister: undefined;
  HeroModification: {heroNo: number};
  HeroSelectingPhoto: undefined;
  HeroShare: {hero: HeroType};
};

const Stack = createNativeStackNavigator<HeroSettingParamList>();

const HeroSettingNavigator = (): JSX.Element => {
  const navigation = useNavigation();
  const resetSelectedHeroPhoto = useResetRecoilState(selectedHeroPhotoState);
  const resetWritingHero = useResetRecoilState(writingHeroState);
  const [writingHero, setWritingHero] = useRecoilState(writingHeroState);
  const seletedHeroPhoto: PhotoIdentifier | undefined = useRecoilValue(
    selectedHeroPhotoState,
  );

  return (
    <Stack.Navigator
      initialRouteName="HeroSetting"
      screenOptions={{headerShadowVisible: false, headerTitleAlign: 'center'}}>
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
                      imageURL: seletedHeroPhoto,
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
