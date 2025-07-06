import React from 'react';
import {useRecoilState} from 'recoil';
import {Color} from '../../constants/color.constant';
import {CustomDateInput} from '../../components/input/CustomDateInput';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer';
import {writingHeroState} from '../../recoils/hero-write.recoil';
import {BasicCard} from '../../components/card/Card.tsx';
import BasicTextInput from '../../components/input/NewTextInput.tsx';
import {BasicButton} from '../../components/button/BasicButton.tsx';
import {useCreateHero} from '../../service/hooks/hero.create.hook.ts';
import {LoadingContainer} from '../../components/loadding/LoadingContainer.tsx';

const HeroRegisterPage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const [writingHero, setWritingHero] = useRecoilState(writingHeroState);
  const [createHero, isLoading] = useCreateHero();

  const navigateToSelectingPhoto = () => {
    navigation.push('NoTab', {
      screen: 'HeroSettingNavigator',
      params: {
        screen: 'HeroSelectingPhoto',
      },
    });
  };
  const heroProfileImage = writingHero?.imageURL?.node.image.uri;

  return (
    <ScreenContainer>
      <LoadingContainer isLoading={isLoading}>
        <ScrollContentContainer alignCenter withScreenPadding gap={32}>
          <ContentContainer
            aspectRatio={0.8701} //0.8701 =  335 / 385
          >
            <BasicCard
              photoUrls={heroProfileImage ? [heroProfileImage] : []}
              editable={true}
              fallbackIconName={'cameraAdd'}
              fallbackText={'클릭하여 프로필 이미지 추가'}
              fallbackBackgroundColor={Color.GREY_100}
              onPress={navigateToSelectingPhoto}
            />
          </ContentContainer>
          <ContentContainer alignCenter>
            <ContentContainer>
              <BasicTextInput
                label={'이름'}
                text={writingHero.heroName}
                onChangeText={heroName => setWritingHero({heroName})}
                placeholder="이름을 입력해 주세요"
              />
              <BasicTextInput
                label={'닉네임'}
                text={writingHero.heroNickName}
                onChangeText={heroNickName => setWritingHero({heroNickName})}
                placeholder="닉네임을 입력해 주세요"
              />
              <CustomDateInput
                label={'태어난 날'}
                date={writingHero.birthday}
                onDateChange={birthday => setWritingHero({birthday})}
              />
            </ContentContainer>
          </ContentContainer>
          <ContentContainer alignCenter>
            <BasicButton
              text={'추가하기'}
              onPress={() => createHero()}
              disabled={
                !writingHero?.heroName ||
                !writingHero?.heroNickName ||
                !writingHero?.birthday
              }
            />
          </ContentContainer>
        </ScrollContentContainer>
      </LoadingContainer>
    </ScreenContainer>
  );
};

export default HeroRegisterPage;
