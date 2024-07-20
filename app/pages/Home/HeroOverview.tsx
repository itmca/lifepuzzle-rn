import React from 'react';
import {HeroType} from '../../types/hero.type';
import {HomeLoginButton} from './HomeLoginButton';
import {LargeTitle} from '../../components/styled/components/Title';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {Image} from 'react-native';

type Props = {
  hero: HeroType;
};

const HeroOverview = ({hero}: Props): JSX.Element => {
  if (hero.heroNo !== -1) {
    return (
      <ContentContainer useHorizontalLayout>
        <ContentContainer width={'auto'}>
          <LargeTitle lineHeight={'35px'}>
            안녕하세요? {'\n'}
            {hero.heroNickName} 님
          </LargeTitle>
        </ContentContainer>
        <ContentContainer
          height="100%"
          width={'auto'}
          top={15}
          style={{
            paddingRight: 20,
          }}>
          <Image
            source={require('../../assets/images/welcome-character.png')}
            style={{width: 100, height: 120}}
          />
        </ContentContainer>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer useHorizontalLayout>
      <LargeTitle>
        우리, 한조각씩 {'\n'}
        함께해 봐요!
      </LargeTitle>
      <HomeLoginButton />
    </ContentContainer>
  );
};

export default HeroOverview;
