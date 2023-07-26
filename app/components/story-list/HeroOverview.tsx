import React from 'react';
import {HeroType} from '../../types/hero.type';
import {HomeLoginButton} from '../button/HomeLoginButton';
import {LargeTitle} from '../styled/components/Title';
import {
  ContentContainer,
  OutLineContentContainer,
} from '../styled/container/ContentContainer';

type Props = {
  hero: HeroType;
};

const HeroOverview = ({hero}: Props): JSX.Element => {
  return (
    <OutLineContentContainer marginTop={'30px'} marginBottom={'30px'}>
      {hero.heroNo !== -1 ? (
        <ContentContainer>
          <LargeTitle lineHeight={'35px'}>
            안녕하세요? {'\n'}
            {hero.heroNickName} 님
          </LargeTitle>
        </ContentContainer>
      ) : (
        <ContentContainer gap={'10px'}>
          <LargeTitle lineHeight={'35px'}>
            우리, 한조각씩 {'\n'}
            함께해 봐요!
          </LargeTitle>
          <HomeLoginButton />
        </ContentContainer>
      )}
    </OutLineContentContainer>
  );
};

export default HeroOverview;
