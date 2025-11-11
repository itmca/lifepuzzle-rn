import {format} from 'date-fns';
import {ContentContainer} from '../../../../components/styled/container/ContentContainer';
import {HeroAvatar} from '../avatar/HeroAvatar';
import {
  BodyTextM,
  Caption,
  Head,
} from '../../../../components/styled/components/Text.tsx';
import {Color} from '../../../../constants/color.constant.ts';
import {PhotoHeroType} from '../../../../types/photo.type.ts';

type Props = {
  hero: PhotoHeroType;
};

const HeroOverview = ({hero}: Props): JSX.Element => {
  if (!hero || hero.id === -1) {
    return <></>;
  }
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
};

export default HeroOverview;
