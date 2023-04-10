import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HeroSettingPage from '../../pages/HeroSetting/HeroSettingPage';
import GoBackHeaderLeft from '../../components/header/GoBackHeaderLeft';
import HeroRegisterPage from '../../pages/HeroRegister/HeroRegisterPage';
import HeroModificationPage from '../../pages/HeroModification/HeroModificationPage';
import HeroSelectingPhotoPage from '../../pages/HeroSelectingPhoto/HeroSelectingPhotoPage';
import WritingHeaderRight from '../../components/header/WritingHeaderRight';
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil';
import {
  selectedHeroPhotoState,
  wrtingHeroState,
} from '../../recoils/hero.recoil';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {useNavigation} from '@react-navigation/native';

export type HeroSettingParamList = {
  HeroSetting: undefined;
  HeroRegister: undefined;
  HeroModification: {heroNo: number};
  HeroSelectingPhoto: undefined;
};

const Stack = createNativeStackNavigator<HeroSettingParamList>();

const HeroSettingNavigator = (): JSX.Element => {
  const navigation = useNavigation();
  const resetSelectedHeroPhoto = useResetRecoilState(selectedHeroPhotoState);
  const resetWritingHero = useResetRecoilState(wrtingHeroState);
  const [modifyingHero, setModifyingHero] = useRecoilState(wrtingHeroState);
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
          headerLeft: () => <GoBackHeaderLeft />,
          title: '주인공 관리',
        }}
      />
      <Stack.Screen
        name="HeroRegister"
        component={HeroRegisterPage}
        options={{
          headerLeft: () => (
            <GoBackHeaderLeft
              customAction={() => {
                resetWritingHero();
              }}
            />
          ),
          title: '주인공 추가',
        }}
      />
      <Stack.Screen
        name="HeroModification"
        component={HeroModificationPage}
        options={{
          headerLeft: () => (
            <GoBackHeaderLeft
              customAction={() => {
                resetWritingHero();
              }}
            />
          ),
          title: '주인공 정보 수정',
        }}
      />
      <Stack.Screen
        name="HeroSelectingPhoto"
        component={HeroSelectingPhotoPage}
        options={{
          headerLeft: () => (
            <GoBackHeaderLeft
              iconType="chevron-left"
              customAction={() => {
                resetSelectedHeroPhoto();
              }}
            />
          ),
          title: '주인공 사진 선택',
          headerRight: () => (
            <WritingHeaderRight
              text="확인"
              customAction={() => {
                setModifyingHero({
                  ...modifyingHero,
                  modifiedImage: seletedHeroPhoto,
                });
                resetSelectedHeroPhoto();
                navigation.goBack();
              }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default HeroSettingNavigator;
