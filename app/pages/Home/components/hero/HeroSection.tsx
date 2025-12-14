import React, { useCallback } from 'react';
import dayjs from 'dayjs';
import { Keyboard, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

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

  // 애니메이션 스타일
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(isCollapsed ? 200 : 240, {
        damping: 35,
        stiffness: 90,
        velocity: 100,
      }),
      paddingVertical: withSpring(isCollapsed ? 0 : 24, {
        damping: 35,
        stiffness: 90,
      }),
    };
  });

  const animatedTextBlockStyle = useAnimatedStyle(() => {
    return {
      gap: withSpring(isCollapsed ? 4 : 8, {
        damping: 35,
        stiffness: 90,
      }),
    };
  });

  if (!hero) {
    return <></>;
  }

  const age = hero.birthday ? toInternationalAge(hero.birthday) : undefined;

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <ContentContainer
        withNoBackground
        width="100%"
        height="100%"
        alignItems="stretch"
        justifyContent="center"
        gap={16}
        paddingHorizontal={20}
      >
        <HeroAvatar
          imageUrl={hero.imageUrl}
          size={90}
          style={styles.avatarBox}
        />

        <Animated.View
          style={[
            styles.textBlock,
            {
              alignItems: 'center',
            },
            animatedTextBlockStyle,
          ]}
        >
          <ContentContainer
            useHorizontalLayout
            width={'auto'}
            gap={6}
            withNoBackground
          >
            <ContentContainer
              useHorizontalLayout
              width={'auto'}
              gap={4}
              alignItems={'baseline'}
              withNoBackground
            >
              <Head numberOfLines={1}>{hero.name}</Head>
              <BodyTextM
                color={Color.GREY_600}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {hero.nickName}
              </BodyTextM>
            </ContentContainer>
            {(hero.auth === 'OWNER' || hero.auth === 'ADMIN') && (
              <ContentContainer
                width={'auto'}
                withNoBackground
                paddingBottom={2}
              >
                <ShareButton onPress={handleSharePress} />
              </ContentContainer>
            )}
          </ContentContainer>
          <ContentContainer
            useHorizontalLayout
            width={'auto'}
            gap={8}
            withNoBackground
          >
            {hero.birthday ? (
              <ContentContainer
                useHorizontalLayout
                width={'auto'}
                gap={2}
                withNoBackground
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
        </Animated.View>
      </ContentContainer>
    </Animated.View>
  );
};

export default HeroSection;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatarBox: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  textBlock: {
    justifyContent: 'center',
    width: '100%',
  },
  shareButtonWrapper: {
    position: 'absolute',
    right: 20,
  },
});
