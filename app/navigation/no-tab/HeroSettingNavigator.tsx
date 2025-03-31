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
import {useUpdateHero} from '../../service/hooks/hero.update.hook.ts';
import {writingHeroState} from '../../recoils/hero-write.recoil';
import {HeroType} from '../../types/hero.type';
import {useCreateHero} from '../../service/hooks/hero.create.hook';
import HeroSettingRightHeader from '../../components/header/HeroSettingRightHeader.tsx';
import {TopBar} from '../../components/styled/components/TopBar.tsx';

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
  const [saveHero] = useUpdateHero();
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
              onBack={resetWritingHero}
              title={'주인공 추가'}
              right={
                <WritingHeaderRight
                  text={'등록'}
                  customAction={() => {
                    createHero();
                  }}
                />
              }
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
              onBack={resetWritingHero}
              title={'주인공 정보 수정'}
              right={
                <WritingHeaderRight
                  text={'저장'}
                  customAction={() => {
                    saveHero();
                  }}
                />
              }
            />
          ),
        }}
      />
      <Stack.Screen
        name="HeroSelectingPhoto"
        component={HeroSelectingPhotoPage}
        options={{
          header: () => (
            <TopBar
              onBack={resetSelectedHeroPhoto}
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
