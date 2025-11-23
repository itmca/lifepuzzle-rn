import React from 'react';
import dayjs from 'dayjs';
import { ContentContainer } from '../../../../components/ui/layout/ContentContainer.tsx';
import { HeroAvatar } from '../avatar/HeroAvatar';
import {
  BodyTextM,
  Caption,
  Head,
} from '../../../../components/ui/base/TextBase';
import { Color } from '../../../../constants/color.constant.ts';
import { HeroType } from '../../../../types/core/hero.type';
import { toInternationalAge } from '../../../../service/utils/date-time.service';

type Props = {
  hero: HeroType;
};

const HeroOverview = ({ hero }: Props): React.ReactElement => {
  if (!hero || hero.heroNo === -1) {
    return <></>;
  }

  const age = toInternationalAge(hero.birthday);

  return (
    <ContentContainer gap={20} flex={1}>
      <ContentContainer useHorizontalLayout gap={8}>
        <HeroAvatar imageUrl={hero.imageUrl} size={52} />
        <ContentContainer gap={4}>
          <ContentContainer
            useHorizontalLayout
            justifyContent={'flex-start'}
            gap={4}
          >
            <Head>
              {hero.heroName.length > 8
                ? hero.heroName.substring(0, 8) + '...'
                : hero.heroName}
            </Head>
            <BodyTextM color={Color.MAIN_DARK}>
              {hero.heroNickName.length > 8
                ? hero.heroNickName.substring(0, 12) + '...'
                : hero.heroNickName}
            </BodyTextM>
          </ContentContainer>

          {hero.birthday ? (
            <ContentContainer
              useHorizontalLayout
              gap={0}
              justifyContent="flex-start"
            >
              <Caption color={Color.GREY_600}>
                {dayjs(hero.birthday).format('YYYY.MM.DD')}
              </Caption>
              <Caption color={Color.GREY_700}>{`(${age}세)`}</Caption>
            </ContentContainer>
          ) : (
            ''
          )}
        </ContentContainer>
      </ContentContainer>
    </ContentContainer>
  );
};

export default HeroOverview;
