import React, { useCallback } from 'react';
import dayjs from 'dayjs';
import { Keyboard } from 'react-native';

import { useHeroStore } from '../../../../stores/hero.store';
import { ContentContainer } from '../../../../components/ui/layout/ContentContainer.tsx';
import { ShareButton } from '../../../../components/feature/sharing/ShareButton';
import { HeroAvatar } from '../avatar/HeroAvatar';
import {
  BodyTextM,
  Caption,
  Head,
} from '../../../../components/ui/base/TextBase';
import { Color } from '../../../../constants/color.constant.ts';
import { toInternationalAge } from '../../../../utils/age-calculator.util.ts';

type Props = {
  onSharePress: () => void;
  isCollapsed?: boolean;
};

const HeroSection = ({
  onSharePress,
  isCollapsed = false,
}: Props): React.ReactElement => {
  // 글로벌 상태 관리 (Zustand)
  const hero = useHeroStore(state => state.currentHero);

  // Custom functions (핸들러, 로직 함수 등)
  const handleSharePress = useCallback(() => {
    Keyboard.dismiss();
    onSharePress();
  }, [onSharePress]);

  if (!hero) {
    return <></>;
  }

  const age = hero.birthday ? toInternationalAge(hero.birthday) : undefined;
  const avatarSize = isCollapsed ? 40 : 52;

  return (
    <ContentContainer
      withScreenPadding
      useHorizontalLayout
      alignItems="center"
      gap={12}
      paddingVertical={isCollapsed ? 8 : undefined}
    >
      <ContentContainer gap={isCollapsed ? 10 : 20} flex={1}>
        <ContentContainer useHorizontalLayout gap={8} alignItems="center">
          <HeroAvatar imageUrl={hero.imageUrl} size={avatarSize} />
          <ContentContainer gap={isCollapsed ? 2 : 4}>
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

            {!isCollapsed && hero.birthday ? (
              <ContentContainer
                useHorizontalLayout
                gap={0}
                justifyContent="flex-start"
              >
                <Caption color={Color.GREY_600}>
                  {dayjs(hero.birthday).format('YYYY.MM.DD')}
                </Caption>
                {age !== undefined ? (
                  <Caption color={Color.GREY_700}>{`(${age}세)`}</Caption>
                ) : null}
              </ContentContainer>
            ) : null}
          </ContentContainer>
        </ContentContainer>
      </ContentContainer>
      {(hero.auth === 'OWNER' || hero.auth === 'ADMIN') && (
        <ContentContainer width={'auto'}>
          <ShareButton onPress={handleSharePress} />
        </ContentContainer>
      )}
    </ContentContainer>
  );
};

export default HeroSection;
