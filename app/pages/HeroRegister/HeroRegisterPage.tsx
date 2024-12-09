import React from 'react';
import {useRecoilState} from 'recoil';
import {Color} from '../../constants/color.constant';
import {HeroAvatar} from '../../components/avatar/HeroAvatar';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {CustomDateInput} from '../../components/input/CustomDateInput';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer';
import {ImageButton} from '../../components/styled/components/Button';
import {writingHeroState} from '../../recoils/hero-write.recoil';
import {Camera} from '../../assets/icons/camera';
import {Photo} from '../../components/styled/components/Image.tsx';
import {XSmallTitle} from '../../components/styled/components/Title.tsx';

const HeroRegisterPage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const [writingHero, setWritingHero] = useRecoilState(writingHeroState);

  const navigateToSelectingPhoto = () => {
    navigation.push('NoTab', {
      screen: 'HeroSettingNavigator',
      params: {
        screen: 'HeroSelectingPhoto',
      },
    });
  };

  var photoUri = writingHero?.imageURL?.node.image.uri;

  return (
    <ScreenContainer>
      {/* <LoadingContainer isLoading={loading}> */}
      <ScrollContentContainer alignCenter withScreenPadding>
        <ContentContainer alignCenter>
          <ImageButton
            backgroundColor="#D6F3FF"
            height="395px"
            width="320px"
            borderRadius={32}
            onPress={navigateToSelectingPhoto}>
            {photoUri ? (
              <Photo
                source={
                  photoUri
                    ? {uri: photoUri}
                    : require('../../assets/images/profile_icon.png')
                }
                borderRadius={32}
              />
            ) : (
              <HeroAvatar
                color="#32C5FF"
                style={{backgroundColor: 'transparent'}}
                size={156}
                imageURL={photoUri}
              />
            )}
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
          <ContentContainer>
            <ContentContainer>
              <XSmallTitle fontWeight={'600'} left={5}>
                이름
              </XSmallTitle>
              <BasicTextInput
                text={writingHero.heroName}
                onChangeText={heroName => setWritingHero({heroName})}
                placeholder="홍길동"
              />
            </ContentContainer>
            <ContentContainer>
              <XSmallTitle fontWeight={'600'} left={5}>
                닉네임
              </XSmallTitle>
              <BasicTextInput
                text={writingHero.heroNickName}
                onChangeText={heroNickName => setWritingHero({heroNickName})}
                placeholder="할아버지"
              />
            </ContentContainer>
            <ContentContainer>
              <XSmallTitle fontWeight={'600'} left={5}>
                태어난 날
              </XSmallTitle>
              <CustomDateInput
                date={writingHero.birthday}
                onChange={birthday => setWritingHero({birthday})}
              />
            </ContentContainer>
          </ContentContainer>
        </ContentContainer>
      </ScrollContentContainer>
    </ScreenContainer>
  );
};

export default HeroRegisterPage;
