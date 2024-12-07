import React, {useEffect, useState} from 'react';
import {HeroType, HeroWithPuzzleCntType} from '../../types/hero.type';
import {useRecoilState} from 'recoil';
import {heroState} from '../../recoils/hero.recoil';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {XSmallText} from '../../components/styled/components/Text';
import {MediumButton} from '../../components/styled/components/Button';
import {Color} from '../../constants/color.constant';
import {Photo} from '../../components/styled/components/Image';
import {ContentContainer} from '../../components/styled/container/ContentContainer.tsx';
import {HeroAvatar} from '../../components/avatar/HeroAvatar.tsx';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types.tsx';

type Props = {
  hero: HeroWithPuzzleCntType;
};

const HeroCard = ({hero}: Props): JSX.Element => {
  const [_, refetch] = useAuthAxios<void>({
    requestOption: {
      method: 'POST',
      url: '/user/hero/recent',
    },
    onResponseSuccess: () => {},
    disableInitialRequest: true,
  });

  const navigation = useNavigation<BasicNavigationProps>();
  const {imageURL, title, heroNo, puzzleCount} = hero;
  const [currentHero, setCurrentHero] = useRecoilState<HeroType>(heroState);
  const [isSelected, setSelected] = useState<boolean>(
    currentHero.heroNo === heroNo,
  );

  useEffect(() => {
    setSelected(currentHero.heroNo === heroNo);
  }, [currentHero]);

  return (
    <ContentContainer paddingHorizontal={8}>
      <ContentContainer alignCenter expandToEnd gap={0}>
        <ContentContainer borderRadius={32} withBorder>
          {imageURL ? (
            <Photo
              source={
                imageURL
                  ? {uri: imageURL}
                  : require('../../assets/images/hero-default-profile.jpeg')
              }
            />
          ) : (
            <ContentContainer
              alignCenter
              height={'100%'}
              paddingBottom={48}
              backgroundColor={Color.SECONDARY_LIGHT}>
              <HeroAvatar
                color="#32C5FF"
                style={{backgroundColor: 'transparent'}}
                size={156}
                imageURL={''}
              />
            </ContentContainer>
          )}
        </ContentContainer>
        <ContentContainer
          absoluteBottomPosition
          withContentPadding
          useHorizontalLayout
          borderBottomRadius={32}
          justifyContent={'flex-end'}
          width={'100%'}
          withNoBackground>
          <MediumButton
            width="80px"
            borderRadius={16}
            backgroundColor={
              isSelected ? Color.PRIMARY_LIGHT : Color.SECONDARY_MEDIUM
            }
            onPress={() => {
              setCurrentHero(hero);
              refetch({
                data: {
                  heroNo,
                },
              });

              navigation.navigate('HomeTab', {screen: 'Home'});
            }}>
            {isSelected ? (
              <XSmallText color={Color.WHITE} bold>
                작성중
              </XSmallText>
            ) : (
              <XSmallText color={Color.PRIMARY_DARK} bold>
                작성하기
              </XSmallText>
            )}
          </MediumButton>
        </ContentContainer>
      </ContentContainer>
    </ContentContainer>
  );
};

export default HeroCard;
