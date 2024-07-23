import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HeroSettingPage from '../../pages/HeroSetting/HeroSettingPage';
import GoBackHeaderLeft from '../../components/header/GoBackHeaderLeft';
import HeroRegisterPage from '../../pages/HeroRegister/HeroRegisterPage';
import HeroModificationPage from '../../pages/HeroModification/HeroModificationPage';
import HeroSharePage from '../../pages/HeroModification/HeroSharePage';
import HeroSelectingPhotoPage from '../../pages/HeroSelectingPhoto/HeroSelectingPhotoPage';
import WritingHeaderRight from '../../components/header/WritingHeaderRight';
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil';
import {selectedHeroPhotoState} from '../../recoils/hero.recoil';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {useNavigation} from '@react-navigation/native';
import Title from '../../components/styled/components/Title';
import {useSaveHero} from '../../service/hooks/hero.write.hook';
import {writingHeroState} from '../../recoils/hero-write.recoil';
import {HeroType} from '../../types/hero.type';
import {Text, View} from 'react-native';
import {useCreateHero} from '../../service/hooks/hero.create.hook';

export type HeroSettingParamList = {
  HeroSetting: {shareKey?: string};
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
  const [saveHero] = useSaveHero();
  const [createHero] = useCreateHero();
  // const [registerHero] = useCreateHero();
  return (
    <Stack.Navigator
      initialRouteName="HeroSetting"
      screenOptions={{headerShadowVisible: false, headerTitleAlign: 'center'}}>
      <Stack.Screen
        name="HeroSetting"
        component={HeroSettingPage}
        options={{
          headerLeft: () => <GoBackHeaderLeft />,
          headerTitle: () => <Title>주인공 관리</Title>,
          headerBackVisible: false,
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
          headerTitle: () => <Title>주인공 생성</Title>,
          headerRight: () => (
            <WritingHeaderRight
              text={'생성'}
              customAction={() => {
                createHero();
              }}
            />
          ),
          headerBackVisible: false,
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
          headerTitle: () => <Title>주인공 정보 수정</Title>,
          headerRight: () => (
            <WritingHeaderRight
              text={'저장'}
              customAction={() => {
                saveHero();
              }}
            />
          ),
          headerBackVisible: false,
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
          headerTitle: () => <Title>주인공 사진 선택</Title>,
          headerBackVisible: false,
          headerRight: () => (
            <WritingHeaderRight
              text="확인"
              customAction={() => {
                setWritingHero({
                  ...writingHero,
                  imageURL: seletedHeroPhoto,
                });
                resetSelectedHeroPhoto();

                navigation.goBack();
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="HeroShare"
        component={HeroSharePage}
        options={{
          headerLeft: () => <GoBackHeaderLeft customAction={() => {}} />,
          headerTitle: () => <Title>주인공 공유</Title>,
          headerBackVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default HeroSettingNavigator;
