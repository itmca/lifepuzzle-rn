import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { PageContainer } from '../../../components/ui/layout/PageContainer';
import { ScrollContainer } from '../../../components/ui/layout/ScrollContainer';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import {
  BodyTextM,
  CaptionM,
  Head,
} from '../../../components/ui/base/TextBase';
import { BasicTextInput } from '../../../components/ui/form/TextInput.tsx';
import { CustomDateInput } from '../../../components/ui/interaction/CustomDateInput.tsx';
import { BasicButton } from '../../../components/ui/form/Button';
import { useHeroStore } from '../../../stores/hero.store';
import { BasicNavigationProps } from '../../../navigation/types';
import { Color } from '../../../constants/color.constant';

const HeroRegisterStep1Page = (): React.ReactElement => {
  // Navigation
  const navigation = useNavigation<BasicNavigationProps>();

  // Zustand store
  const { writingHero, setWritingHero } = useHeroStore();

  // Validation
  const isFormValid =
    writingHero.name && writingHero.nickName && writingHero.birthday;

  const handleNext = () => {
    navigation.navigate('App', {
      screen: 'HeroSettingNavigator',
      params: {
        screen: 'HeroRegisterStep2',
      },
    });
  };

  return (
    <PageContainer edges={['left', 'right', 'bottom']}>
      <ScrollContainer keyboardAware>
        <ContentContainer withScreenPadding gap={24}>
          <ContentContainer gap={8}>
            <Head>기억을 남기고 싶은 분은 누구인가요?</Head>
            <BodyTextM color={Color.GREY_600}>
              기록할 사람을 한 분 추가해 주세요
            </BodyTextM>
          </ContentContainer>

          <ContentContainer gap={16}>
            <BasicTextInput
              label={'이름'}
              text={writingHero.name ?? ''}
              onChangeText={name => setWritingHero({ name })}
              placeholder="홍길동"
            />
            <BasicTextInput
              label={'어떻게 불러왔나요? \n(닉네임)'}
              text={writingHero.nickName ?? ''}
              onChangeText={nickName => setWritingHero({ nickName })}
              placeholder="할아버지"
            />
            <CustomDateInput
              label={'태어난 날'}
              date={writingHero.birthday}
              onDateChange={birthday => setWritingHero({ birthday })}
            />
            <ContentContainer gap={0}>
              <CaptionM color={Color.GREY_800}>
                정확하지 않아도 괜찮아요. 알고 있는 만큼만 입력해 주세요.
              </CaptionM>
              <CaptionM color={Color.GREY_800}>
                나중에 수정할 수 있습니다.
              </CaptionM>
            </ContentContainer>
          </ContentContainer>

          <BasicButton
            text="다음"
            onPress={handleNext}
            disabled={!isFormValid}
          />
        </ContentContainer>
      </ScrollContainer>
    </PageContainer>
  );
};

export { HeroRegisterStep1Page };
