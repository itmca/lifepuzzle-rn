import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { PageContainer } from '../../../components/ui/layout/PageContainer';
import { ScrollContainer } from '../../../components/ui/layout/ScrollContainer';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import { Head, BodyTextM } from '../../../components/ui/base/TextBase';
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
            <Head>추억의 주인공을 추가하세요</Head>
            <BodyTextM color={Color.GREY_600}>
              소중한 사람의 정보를 입력해주세요
            </BodyTextM>
          </ContentContainer>

          <ContentContainer gap={16}>
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
