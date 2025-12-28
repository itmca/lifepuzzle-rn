import React from 'react';
import { Color } from '../../../../../constants/color.constant.ts';
import { ButtonBase } from '../../../../../components/ui/base/ButtonBase';
import { CaptionB } from '../../../../../components/ui/base/TextBase';
import { SvgIcon } from '../../../../../components/ui/display/SvgIcon.tsx';
import { ContentContainer } from '../../../../../components/ui/layout/ContentContainer';

type Props = {
  onPress: () => void;
  bottomPadding?: number;
};

export const AiPhotoButton = ({
  onPress,
  bottomPadding,
}: Props): React.ReactElement => {
  return (
    <ContentContainer
      width={'auto'}
      absoluteBottomPosition
      absoluteRightPosition
      paddingBottom={bottomPadding ?? 10}
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
        <CaptionB color={Color.GREY_600}>AI 포토 만들기</CaptionB>
      </ButtonBase>
    </ContentContainer>
  );
};
