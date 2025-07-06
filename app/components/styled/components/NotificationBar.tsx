import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../../navigation/types.tsx';
import {ContentContainer} from '../container/ContentContainer.tsx';
import {BodyTextB} from './Text.tsx';
import {Color} from '../../../constants/color.constant.ts';
type Props = {
  text?: string;
};

export const NotificationBar = ({text = ''}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <ContentContainer
      height={'44px'}
      borderRadius={6}
      backgroundColor={Color.GREY_600}
      paddingHorizontal={14}
      paddingVertical={12}>
      <BodyTextB color={Color.WHITE}>{text}</BodyTextB>
    </ContentContainer>
  );
};
