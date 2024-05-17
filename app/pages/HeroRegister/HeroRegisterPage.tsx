import React, {useEffect, useState} from 'react';
import {Alert, ImageBackground, Text, View} from 'react-native';
import {styles} from './styles';
import CtaButton from '../../components/button/CtaButton';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil';
import {IMG_TYPE} from '../../constants/upload-file-type.constant';
import {Color} from '../../constants/color.constant';
import {HeroType} from '../../types/hero.type';
import {HeroAvatar} from '../../components/avatar/HeroAvatar';
import SelectablePhoto from '../../components/photo/SelectablePhoto';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useUpdatePublisher} from '../../service/hooks/update.hooks';
import {heroUpdate} from '../../recoils/update.recoil';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {CustomDateInput} from '../../components/input/CustomDateInput';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {useNavigation} from '@react-navigation/native';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {BasicNavigationProps} from '../../navigation/types';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {ScrollContainer} from '../../components/styled/container/ScrollContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {ImageButton} from '../../components/styled/components/Button';
import {
  getCurrentHeroPhotoUri,
  writingHeroState,
} from '../../recoils/hero-write.recoil';
import {Camera} from '../../assets/icons/camera';

const HeroRegisterPage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const publishHeroUpdate = useUpdatePublisher(heroUpdate);
  const [newHero, setNewHero] = useState<HeroType>({
    heroNo: -1,
    heroName: '',
    heroNickName: '',
    birthday: undefined,
    title: '',
  });

  const resetWritingHero = useResetRecoilState(writingHeroState);
  const [writingHero, setWritingHero] = useRecoilState(writingHeroState);
  const currentHeroPhotoUri = useRecoilValue(getCurrentHeroPhotoUri);

  const navigateToSelectingPhoto = () => {
    navigation.push('NoTab', {
      screen: 'HeroSettingNavigator',
      params: {
        screen: 'HeroSelectingPhoto',
      },
    });
  };

  return (
    <ScreenContainer>
      {/* <LoadingContainer isLoading={loading}> */}
      <ScrollContainer
        contentContainerStyle={styles.formContainer}
        extraHeight={0}
        keyboardShouldPersistTaps={'always'}>
        <ContentContainer gap="15px" alignItems="center">
          <ImageButton
            backgroundColor="#D6F3FF"
            height="395px"
            width="320px"
            borderRadius="12"
            onPress={navigateToSelectingPhoto}>
            <HeroAvatar
              color="#32C5FF"
              style={{backgroundColor: 'transparent'}}
              size={156}
              imageURL={currentHeroPhotoUri}
            />
            <Camera
              style={{
                backgroundColor: Color.WHITE,
                position: 'absolute',
                right: 15,
                bottom: 15,
              }}
              size={34}
              color="#323232"
            />
          </ImageButton>
          <BasicTextInput
            label="이름"
            text={writingHero.heroName}
            onChangeText={heroName => setWritingHero({heroName})}
            placeholder="홍길동"
          />
          <BasicTextInput
            label="닉네임"
            text={writingHero.heroNickName}
            onChangeText={heroNickName => setWritingHero({heroNickName})}
            placeholder="소중한 당신"
          />
          <BasicTextInput
            label="제목"
            placeholder={'행복했던 나날들'}
            text={writingHero.title}
            onChangeText={title => setWritingHero({title})}
          />
          <View style={{width: '100%'}}>
            <CustomDateInput
              label="태어난 날"
              date={writingHero.birthday}
              onChange={birthday => setWritingHero({birthday})}
            />
          </View>
        </ContentContainer>
      </ScrollContainer>
      {/* </LoadingContainer> */}
    </ScreenContainer>
  );
};

export default HeroRegisterPage;
