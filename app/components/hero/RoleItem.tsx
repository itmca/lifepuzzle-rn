import React from 'react';
import {Text} from 'react-native';
import {Color} from '../../constants/color.constant';
import {CodeType, LinkedUserType} from '../../types/hero.type';
import {ImageButton} from '../styled/components/Button';
import {MediumImage} from '../styled/components/Image';
import {XSmallText, MediumText} from '../styled/components/Text';
import {XSmallTitle} from '../styled/components/Title';
import {
  ContentContainer,
  HorizontalContentContainer,
} from '../styled/container/ContentContainer';

type props = {
  target: LinkedUserType;
  role: CodeType;
  onSelect: Function;
};

export const RoleItem = ({target, role, onSelect}: props): JSX.Element => {
  return (
    <ImageButton
      backgroundColor={'transparent'}
      onPress={() => {
        onSelect(role.code);
      }}>
      <HorizontalContentContainer height={'40px'}>
        <ContentContainer width={'37px'} alignItems={'center'}>
          {target.role === role.code ? (
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
          <MediumText fontWeight={'600'}>{role.name}</MediumText>
          {role.description ? (
            <XSmallText fontWeight={'600'} color={Color.DARK_GRAY}>
              {role.description}
            </XSmallText>
          ) : (
            <></>
          )}
        </ContentContainer>
      </HorizontalContentContainer>
    </ImageButton>
  );
};
