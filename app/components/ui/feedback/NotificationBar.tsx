import React from 'react';
import { ContentContainer } from '../layout/ContentContainer.tsx';
import { BodyTextB } from '../base/TextBase.tsx';
import { Color } from '../../../constants/color.constant.ts';

type Props = {
  text?: string;
};

export const NotificationBar = ({ text = '' }: Props): React.ReactElement => {
  return (
    <ContentContainer
      height={44}
      borderRadius={6}
      backgroundColor={Color.GREY_600}
      paddingHorizontal={14}
      paddingVertical={12}
    >
      <BodyTextB color={Color.WHITE}>{text}</BodyTextB>
    </ContentContainer>
  );
};
