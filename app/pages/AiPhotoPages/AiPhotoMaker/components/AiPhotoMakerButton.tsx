import React from 'react';

import { Color } from '../../../constants/color.constant.ts';
import { ButtonBase } from '../../../components/ui/base/ButtonBase';
import { Title } from '../../../components/ui/base/TextBase';
import { SvgIcon } from '../../../components/ui/display/SvgIcon';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';

type Props = {
  onPress: () => void;
};

export const AiPhotoMakerButton = ({ onPress }: Props): React.ReactElement => {
  return (
    <ButtonBase
      height={'56px'}
      width={'100%'}
      backgroundColor={Color.MAIN_DARK}
      borderRadius={6}
      onPress={onPress}
    >
      <ContentContainer
        gap={3}
        useHorizontalLayout
        backgroundColor="transparent"
        alignCenter
      >
        <SvgIcon name={'aiWhite'} size={24} />
        <Title color={Color.WHITE}>AI포토 만들기</Title>
      </ContentContainer>
    </ButtonBase>
  );
};
