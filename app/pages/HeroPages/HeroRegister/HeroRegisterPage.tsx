import React from 'react';

import { Color } from '../../../constants/color.constant';
import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../../navigation/types';
import { ScreenContainer } from '../../../components/ui/layout/ScreenContainer';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import { useHeroStore } from '../../../stores/hero.store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { BasicCard } from '../../../components/ui/display/Card';
import BasicTextInput from '../../../components/ui/form/TextInput.tsx';
import { BasicButton } from '../../../components/ui/form/Button';
import { useCreateHero } from '../../../services/hero/hero.create.hook.ts';
import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer';
import { CustomDateInput } from '../../../components/ui/interaction/CustomDateInput.tsx';
import { getHeroImageUri } from '../../../utils/hero-image.util';

const HeroRegisterPage = (): React.ReactElement => {
  // 글로벌 상태 관리
  const { writingHero, setWritingHero } = useHeroStore();

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Derived value or local variables
  const heroProfileImage = getHeroImageUri(writingHero);

  // Custom hooks
  const [createHero, isLoading] = useCreateHero();

  // Custom functions
  const navigateToSelectingPhoto = () => {
    navigation.navigate('App', {
      screen: 'HeroSettingNavigator',
      params: {
        screen: 'HeroProfileSelector',
      },
    });
  };

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']}>
      <LoadingContainer isLoading={isLoading}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          bottomOffset={20}
        >
          <ContentContainer alignCenter withScreenPadding gap={32}>
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
                  text={writingHero.name ?? ''}
                  onChangeText={name => setWritingHero({ name })}
                  placeholder="이름을 입력해 주세요"
                />
                <BasicTextInput
                  label={'닉네임'}
                  text={writingHero.nickName ?? ''}
                  onChangeText={nickName => setWritingHero({ nickName })}
                  placeholder="닉네임을 입력해 주세요"
                />
                <CustomDateInput
                  label={'태어난 날'}
                  date={writingHero.birthday}
                  onDateChange={birthday => setWritingHero({ birthday })}
                />
              </ContentContainer>
            </ContentContainer>
            <ContentContainer alignCenter>
              <BasicButton
                text={'추가하기'}
                onPress={() => createHero()}
                disabled={
                  !writingHero?.name ||
                  !writingHero?.nickName ||
                  !writingHero?.birthday
                }
              />
            </ContentContainer>
          </ContentContainer>
        </KeyboardAwareScrollView>
      </LoadingContainer>
    </ScreenContainer>
  );
};

export default HeroRegisterPage;
