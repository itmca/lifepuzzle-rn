import React from 'react';
import {HeroType} from '../../types/hero.type';
import {HomeLoginButton} from './HomeLoginButton';
import {
  LargeTitle,
  MediumTitle,
  SmallTitle,
} from '../../components/styled/components/Title';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {HeroAvatar} from '../../components/avatar/HeroAvatar.tsx';
import {SmallText} from '../../components/styled/components/Text.tsx';
import {XSmallImage} from '../../components/styled/components/Image.tsx';
import {toHeroBirthdayAge} from '../../service/date-time-display.service.ts';
import {Image, Platform} from 'react-native';

type Props = {
  hero: HeroType;
  puzzleCount: number;
};

const HeroOverview = ({hero, puzzleCount}: Props): JSX.Element => {
  if (hero.heroNo !== -1) {
    return (
      <ContentContainer gap={20} paddingVertical={8}>
        <ContentContainer width={'auto'} style={{alignSelf: 'flex-start'}}>
          <MediumTitle>{hero.title}</MediumTitle>
          <ContentContainer zIndex={-1} absoluteBottomPosition width={'auto'}>
            <Image
              source={require('../../assets/images/underline-blue.png')}
              style={{
                height: 8,
                width: hero.title ? hero.title.length * 16 : 0,
              }}
            />
          </ContentContainer>
        </ContentContainer>
        <ContentContainer useHorizontalLayout>
          <HeroAvatar imageURL={hero.imageURL} size={80} />
          <ContentContainer gap={8}>
            <ContentContainer
              useHorizontalLayout
              justifyContent={'flex-start'}
              gap={4}>
              <SmallTitle>
                {hero.heroName.length > 8
                  ? hero.heroName.substring(0, 8) + '...'
                  : hero.heroName}
              </SmallTitle>
              <SmallText>
                {hero.heroNickName.length > 8
                  ? hero.heroNickName.substring(0, 12) + '...'
                  : hero.heroNickName}
              </SmallText>
            </ContentContainer>
            <ContentContainer>
              <SmallText>
                {hero.birthday ? toHeroBirthdayAge(hero.birthday) : '-'}
              </SmallText>
            </ContentContainer>
            <ContentContainer
              paddingVertical={2}
              useHorizontalLayout
              justifyContent={'flex-start'}
              gap={4}>
              <XSmallImage
                source={require('../../assets/images/puzzle-onepiece.png')}
              />
              <SmallText>{puzzleCount}개</SmallText>
            </ContentContainer>
          </ContentContainer>
        </ContentContainer>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer
      useHorizontalLayout
      paddingTop={Platform.OS === 'android' ? 20 : 16}
      paddingBottom={16}
      justifyContent={'flex-start'}>
      <ContentContainer flex={1} gap={8}>
        <LargeTitle>우리, 한조각씩</LargeTitle>
        <LargeTitle>함께해 봐요!</LargeTitle>
      </ContentContainer>
      <ContentContainer flex={1} alignItems={'flex-end'}>
        <HomeLoginButton />
      </ContentContainer>
    </ContentContainer>
  );
};

export default HeroOverview;
