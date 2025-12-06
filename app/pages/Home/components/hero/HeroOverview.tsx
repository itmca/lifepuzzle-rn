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
  compact?: boolean;
};

const HeroOverview = ({ hero, compact = false }: Props): React.ReactElement => {
  if (!hero || hero.id === -1) {
    return <></>;
  }

  const age = toInternationalAge(hero.birthday);
  const avatarSize = compact ? 40 : 52;

  return (
    <ContentContainer gap={compact ? 10 : 20} flex={1}>
      <ContentContainer useHorizontalLayout gap={8} alignItems="center">
        <HeroAvatar imageUrl={hero.imageUrl} size={avatarSize} />
        <ContentContainer gap={compact ? 2 : 4}>
          <ContentContainer
            useHorizontalLayout
            justifyContent={'flex-start'}
            gap={4}
          >
            <Head>
              {hero.name.length > 8
                ? hero.name.substring(0, 8) + '...'
                : hero.name}
            </Head>
            <BodyTextM color={Color.MAIN_DARK}>
              {hero.nickName.length > 8
                ? hero.nickName.substring(0, 12) + '...'
                : hero.nickName}
            </BodyTextM>
          </ContentContainer>

          {!compact && hero.birthday ? (
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
          ) : null}
        </ContentContainer>
      </ContentContainer>
    </ContentContainer>
  );
};

export default HeroOverview;
