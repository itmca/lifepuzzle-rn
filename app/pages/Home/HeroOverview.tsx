import {format} from 'date-fns';
import {HomeLoginButton} from './HomeLoginButton';
import {LargeTitle, SmallTitle} from '../../components/styled/components/Title';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {HeroAvatar} from '../../components/avatar/HeroAvatar.tsx';
import {SmallText} from '../../components/styled/components/LegacyText.tsx';
import {Platform} from 'react-native';
import {PhotoHeroType} from '../../types/photo.type.ts';
import {
  BodyTextM,
  Caption,
  Head,
} from '../../components/styled/components/Text.tsx';
import {Color} from '../../constants/color.constant.ts';

type Props = {
  hero: PhotoHeroType;
};

const HeroOverview = ({hero}: Props): JSX.Element => {
  if (hero && hero.id !== -1) {
    return (
      <ContentContainer gap={20} flex={1}>
        <ContentContainer useHorizontalLayout gap={8}>
          <HeroAvatar imageURL={hero.image} size={52} />
          <ContentContainer gap={4}>
            <ContentContainer
              useHorizontalLayout
              justifyContent={'flex-start'}
              gap={4}>
              <Head>
                {hero.name.length > 8
                  ? hero.name.substring(0, 8) + '...'
                  : hero.name}
              </Head>
              <BodyTextM color={Color.MAIN_DARK}>
                {hero.nickname.length > 8
                  ? hero.nickname.substring(0, 12) + '...'
                  : hero.nickname}
              </BodyTextM>
            </ContentContainer>

            {hero.birthdate ? (
              <ContentContainer
                useHorizontalLayout
                gap={0}
                justifyContent="flex-start">
                <Caption color={Color.GREY_600}>
                  {format(new Date(hero.birthdate), 'yyyy.MM.dd')}
                </Caption>
                <Caption color={Color.GREY_700}>{`(${hero.age}세)`}</Caption>
              </ContentContainer>
            ) : (
              ''
            )}
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
