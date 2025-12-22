import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';
import { ContentContainer } from '../../../../components/ui/layout/ContentContainer.tsx';
import {
  BodyTextB,
  Caption,
  Head,
} from '../../../../components/ui/base/TextBase';
import { BasicButton } from '../../../../components/ui/form/Button';
import { Color } from '../../../../constants/color.constant.ts';
import { HeroType } from '../../../../types/core/hero.type';
import { toInternationalAge } from '../../../../utils/age-calculator.util.ts';

type HeroInfoSectionProps = {
  hero: HeroType;
  currentHero: HeroType | null;
  onEditPress: () => void;
  onViewPress: () => void;
};

const HeroInfoSectionComponent = ({
  hero,
  currentHero,
  onEditPress,
  onViewPress,
}: HeroInfoSectionProps): React.ReactElement => {
  const isCurrentHero = currentHero?.id === hero.id;

  return (
    <ContentContainer withScreenPadding paddingVertical={0}>
      <ContentContainer useHorizontalLayout paddingVertical={6}>
        <ContentContainer gap={4} flex={1} expandToEnd>
          <ContentContainer
            useHorizontalLayout
            width={'auto'}
            justifyContent={'flex-start'}
            gap={4}
          >
            <Head>
              {hero.name.length > 8
                ? hero.name.substring(0, 8) + '...'
                : hero.name}
            </Head>
            <BodyTextB color={Color.GREY_400}>
              {hero.nickName.length > 8
                ? hero.nickName.substring(0, 12) + '...'
                : hero.nickName}
            </BodyTextB>
          </ContentContainer>
          <ContentContainer
            useHorizontalLayout
            width={'auto'}
            justifyContent={'flex-start'}
            alignItems={'flex-start'}
            gap={4}
          >
            <Caption color={Color.GREY_600}>
              {hero.isLunar ? '음력' : '양력'}
            </Caption>
            <Caption color={Color.GREY_700}>
              {dayjs(hero.birthday).format('YYYY.MM.DD')}
            </Caption>
            <Caption color={Color.GREY_600}>
              (만 {toInternationalAge(hero.birthday)}세)
            </Caption>
          </ContentContainer>
        </ContentContainer>
        <ContentContainer width={'auto'}>
          {hero.auth !== 'VIEWER' && (
            <TouchableOpacity onPress={onEditPress}>
              <BodyTextB color={Color.MAIN_DARK}>수정하기</BodyTextB>
            </TouchableOpacity>
          )}
        </ContentContainer>
      </ContentContainer>
      <ContentContainer>
        <BasicButton
          onPress={onViewPress}
          disabled={isCurrentHero}
          text={isCurrentHero ? '지금 보고 있어요' : '보기'}
        />
      </ContentContainer>
    </ContentContainer>
  );
};

export const HeroInfoSection = memo(HeroInfoSectionComponent);
