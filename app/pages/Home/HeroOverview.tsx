import React from 'react';
import {HeroType} from '../../types/hero.type';
import {HomeLoginButton} from './HomeLoginButton';
import {LargeTitle} from '../../components/styled/components/Title';
import {
  ContentContainer,
  HorizontalContentContainer,
} from '../../components/styled/container/ContentContainer';
import {Image} from 'react-native';

type Props = {
  hero: HeroType;
};

const HeroOverview = ({hero}: Props): JSX.Element => {
  return (
    <ContentContainer>
      {hero.heroNo !== -1 ? (
        <>
          <ContentContainer padding={16} marginTop="25px" marginBottom="25px">
            <LargeTitle lineHeight={'35px'}>
              안녕하세요? {'\n'}
              {hero.heroNickName} 님
            </LargeTitle>
          </ContentContainer>
          <ContentContainer
            position="absolute"
            height="100%"
            alignItems="flex-end"
            top={15}
            style={{
              paddingRight: 20,
            }}>
            <Image
              source={require('../../assets/images/welcome-character.png')}
              style={{width: 140, height: 170}}
            />
          </ContentContainer>
        </>
      ) : (
        <HorizontalContentContainer
          padding={16}
          alignItems="center"
          marginTop="25px"
          marginBottom="25px"
          justifyContent="space-between">
          <LargeTitle lineHeight={'35px'}>
            우리, 한조각씩 {'\n'}
            함께해 봐요!
          </LargeTitle>
          <HomeLoginButton />
        </HorizontalContentContainer>
      )}
    </ContentContainer>
  );
};

export default HeroOverview;
