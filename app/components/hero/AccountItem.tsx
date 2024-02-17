import React from 'react';
import {MediumImage} from '../../components/styled/components/Image';
import {Color} from '../../constants/color.constant';
import {RoleList} from '../../constants/role.constant';
import {LinkedUserType} from '../../types/hero.type';
import {ImageButton} from '../styled/components/Button';
import {SmallText} from '../styled/components/Text';
import {
  ContentContainer,
  HorizontalContentContainer,
} from '../styled/container/ContentContainer';

type props = {
  linkedUser: LinkedUserType;
  onSelect: Function;
};

export const AccountItem = ({linkedUser, onSelect}: props): JSX.Element => {
  return (
    <HorizontalContentContainer height={'50px'}>
      <ContentContainer width={'58px'}>
        <MediumImage
          width={48}
          height={48}
          source={
            linkedUser?.imageURL ??
            require('../../assets/images/profile_icon.png')
          }
        />
      </ContentContainer>
      <ContentContainer flex={1}>
        <SmallText>{linkedUser.userNickName}</SmallText>
        <SmallText color={Color.FONT_GRAY}>
          {RoleList.map(value => {
            if (value.code == linkedUser.role) {
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
            onSelect(linkedUser);
          }}>
          <MediumImage
            width={20}
            height={20}
            source={require('../../assets/images/setting.png')}
          />
        </ImageButton>
      </ContentContainer>
    </HorizontalContentContainer>
  );
};
