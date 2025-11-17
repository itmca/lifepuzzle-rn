import React from 'react';

import { Color } from '../../../constants/color.constant.ts';
import { ButtonBase } from '../../ui/base/ButtonBase';
import { Caption } from '../../ui/base/TextBase';
import { SvgIcon } from '../../ui/display/SvgIcon.tsx';
import { StyleSheet, View } from 'react-native';
import { ContentContainer } from '../../ui/layout/ContentContainer';

type Props = {
  onPress: () => void;
};

export const AiPhotoButton = ({ onPress }: Props): React.ReactElement => {
  return (
    <ContentContainer
      width={'auto'}
      absoluteBottomPosition
      absoluteRightPosition
      paddingBottom={10}
      paddingRight={10}
      withNoBackground
    >
      <ButtonBase
        height={'28px'}
        width={'auto'}
        backgroundColor={Color.WHITE}
        borderColor={Color.GREY_200}
        paddingVertical={4}
        paddingLeft={4}
        paddingRight={6}
        borderRadius={6}
        borderWidth={1}
        onPress={onPress}
        borderInside
      >
        <SvgIcon name={'aiSmall'} color={Color.AI_500} size={16} />
        <Caption color={Color.GREY_600}>AI 포토 만들기</Caption>
      </ButtonBase>
    </ContentContainer>
  );
};
