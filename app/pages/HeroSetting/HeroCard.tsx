import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {HeroType, HeroWithPuzzleCntType} from '../../types/hero.type';
import {useRecoilState} from 'recoil';
import {heroState} from '../../recoils/hero.recoil';
import {useAuthAxios} from '../../service/hooks/network.hook';
import Text, {XSmallText} from '../../components/styled/components/Text';
import {MediumButton} from '../../components/styled/components/Button';
import {Color} from '../../constants/color.constant';
import {Photo} from '../../components/styled/components/Image';
import {ContentContainer} from '../../components/styled/container/ContentContainer.tsx';
import {HeroAvatar} from '../../components/avatar/HeroAvatar.tsx';

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
          backgroundColor={'rgba(0,0,0,0.7)'}>
          <ContentContainer withNoBackground width={'auto'} gap={4}>
            <Text color={Color.WHITE}>{title}</Text>
            <View style={styles.heroPhotoContainer}>
              <Photo
                style={styles.logoImage}
                width={16}
                height={16}
                source={require('../../assets/images/puzzle-onepiece.png')}
              />
              <XSmallText color={Color.WHITE}>{puzzleCount}개</XSmallText>
            </View>
          </ContentContainer>
          <MediumButton
            width="52px"
            borderRadius={16}
            marginBottom="0px"
            backgroundColor={isSelected ? Color.PRIMARY_LIGHT : '#D4F3FF'}
            onPress={() => {
              setCurrentHero(hero);
              refetch({
                data: {
                  heroNo,
                },
              });
            }}>
            {isSelected ? (
              <XSmallText color={Color.WHITE}>작성중</XSmallText>
            ) : (
              <XSmallText color={Color.PRIMARY_LIGHT}>선택</XSmallText>
            )}
          </MediumButton>
        </ContentContainer>
      </ContentContainer>
    </ContentContainer>
  );
};

export default HeroCard;
