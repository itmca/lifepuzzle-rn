import React, { memo } from 'react';
import { BasicNavigationProps } from '../../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import { BasicCard } from '../../../components/ui/display/Card';
import { Color } from '../../../constants/color.constant.ts';
import { BasicTextInput } from '../../../components/ui/form/TextInput.tsx';
import { CustomDateInput } from '../../../components/ui/interaction/CustomDateInput.tsx';
import { WritingHeroType } from '../../../types/core/hero.type.ts';
import { getHeroImageUri } from '../../../utils/hero-image.util.ts';

type HeroFormContentProps = {
  writingHero: WritingHeroType;
  onChangeHero: (updates: Partial<WritingHeroType>) => void;
};

const HERO_CARD_ASPECT_RATIO = 335 / 385; // 0.8701

const HeroFormContentComponent = ({
  writingHero,
  onChangeHero,
}: HeroFormContentProps): React.ReactElement => {
  const navigation = useNavigation<BasicNavigationProps>();

  const heroProfileImage = getHeroImageUri(writingHero);

  const navigateToProfileSelector = () => {
    navigation.navigate('App', {
      screen: 'HeroSettingNavigator',
      params: {
        screen: 'HeroProfileSelector',
      },
    });
  };

  return (
    <ContentContainer alignCenter withScreenPadding gap={32}>
      <ContentContainer aspectRatio={HERO_CARD_ASPECT_RATIO}>
        <BasicCard
          photoUrls={heroProfileImage ? [heroProfileImage] : []}
          editable={true}
          fallbackIconName={'cameraAdd'}
          fallbackText={'클릭하여 프로필 이미지 추가'}
          fallbackBackgroundColor={Color.GREY_100}
          onPress={navigateToProfileSelector}
        />
      </ContentContainer>
      <ContentContainer alignCenter>
        <ContentContainer>
          <BasicTextInput
            label={'이름'}
            text={writingHero.name ?? ''}
            onChangeText={name => onChangeHero({ name })}
            placeholder="이름을 입력해 주세요"
          />
          <BasicTextInput
            label={'닉네임'}
            text={writingHero.nickName ?? ''}
            onChangeText={nickName => onChangeHero({ nickName })}
            placeholder="닉네임을 입력해 주세요"
          />
          <CustomDateInput
            label={'태어난 날'}
            date={writingHero.birthday}
            onDateChange={birthday => onChangeHero({ birthday })}
          />
        </ContentContainer>
      </ContentContainer>
    </ContentContainer>
  );
};

export const HeroFormContent = memo(HeroFormContentComponent);
