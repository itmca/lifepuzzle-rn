import React from 'react';
import {useRecoilState} from 'recoil';
import {Color} from '../../constants/color.constant';
import {writingHeroState} from '../../recoils/hero-write.recoil';
import {CodeType} from '../../types/code.type';
import {HeroUserType} from '../../types/hero.type';
import {ImageButton} from '../styled/components/Button';
import {MediumImage} from '../styled/components/Image';
import {XSmallText, MediumText} from '../styled/components/Text';
import {
  ContentContainer,
  HorizontalContentContainer,
} from '../styled/container/ContentContainer';

type props = {
  auth: CodeType;
  selected: boolean;
  onSelect: Function;
};

export const AuthItem = ({auth, selected, onSelect}: props): JSX.Element => {
  const [writingHero, setWritingHero] = useRecoilState(writingHeroState);

  const onSubmit = () => {
    onSelect(auth.code);
  };
  return (
    <ImageButton
      backgroundColor={'transparent'}
      onPress={() => {
        onSubmit();
      }}>
      <HorizontalContentContainer height={'56px'}>
        <ContentContainer width={'40px'} alignItems={'center'}>
          {selected ? (
            <MediumImage
              width={22}
              source={require('../../assets/images/check-round-edge.png')}
              resizeMode={'contain'}
            />
          ) : (
            <></>
          )}
        </ContentContainer>
        <ContentContainer flex={1}>
          <MediumText fontWeight={'600'}>{auth.name}</MediumText>
          {auth.description ? (
            <XSmallText fontWeight={'600'} color={Color.DARK_GRAY}>
              {auth.description}
            </XSmallText>
          ) : (
            <></>
          )}
        </ContentContainer>
      </HorizontalContentContainer>
    </ImageButton>
  );
};
