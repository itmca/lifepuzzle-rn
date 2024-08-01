import React from 'react';
import {MediumImage} from '../../components/styled/components/Image';
import {Color} from '../../constants/color.constant';
import {AuthList} from '../../constants/auth.constant';
import {ImageButton} from '../styled/components/Button';
import {SmallText} from '../styled/components/Text';
import {ContentContainer} from '../styled/container/ContentContainer';
import {HeroUserType} from '../../types/hero.type';

type props = {
  user: HeroUserType;
  onSelect: Function;
};

export const AccountItem = ({user, onSelect}: props): JSX.Element => {
  return (
    <ContentContainer height={'50px'} useHorizontalLayout>
      <ContentContainer width={'58px'}>
        <MediumImage
          width={48}
          height={48}
          borderRadius={20}
          source={
            user.imageURL
              ? {uri: user.imageURL}
              : require('../../assets/images/profile_icon.png')
          }
        />
      </ContentContainer>
      <ContentContainer flex={1}>
        <SmallText>{user.nickName}</SmallText>
        <SmallText color={Color.FONT_GRAY}>
          {AuthList.map(value => {
            if (value.code == user.auth) {
              return value.name;
            }
          })}
        </SmallText>
      </ContentContainer>
      <ContentContainer width={'30px'}>
        <ImageButton
          width={'20px'}
          backgroundColor={'transparent'}
          onPress={() => {
            onSelect(user);
          }}>
          <MediumImage
            width={20}
            height={20}
            source={require('../../assets/images/setting.png')}
          />
        </ImageButton>
      </ContentContainer>
    </ContentContainer>
  );
};
