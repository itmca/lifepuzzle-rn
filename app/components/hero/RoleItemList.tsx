import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React from 'react';
import {RoleList} from '../../constants/role.constant';
import {LinkedUserType} from '../../types/hero.type';
import {MediumImage} from '../styled/components/Image';
import MediumText from '../styled/components/Text';

import {
  ContentContainer,
  HorizontalContentContainer,
} from '../styled/container/ContentContainer';
import {ScreenContainer} from '../styled/container/ScreenContainer';
import {RoleItem} from './RoleItem';

type props = {
  target: LinkedUserType;
  onSelect: Function;
};

export const RoleItemList = ({target, onSelect}: props): JSX.Element => {
  return (
    <>
      {target ? (
        <HorizontalContentContainer height={'50px'}>
          <ContentContainer width={'60px'}>
            <MediumImage
              width={48}
              height={48}
              resizeMode={'contain'}
              source={
                target?.imageURL ??
                require('../../assets/images/profile_icon.png')
              }
            />
          </ContentContainer>
          <ContentContainer flex={1}>
            <MediumText fontWeight={'600'}>{target?.userNickName}</MediumText>
          </ContentContainer>
        </HorizontalContentContainer>
      ) : (
        <></>
      )}
      {RoleList.map((role, index) => (
        <RoleItem key={index} target={target} role={role} onSelect={onSelect} />
      ))}
    </>
  );
};
