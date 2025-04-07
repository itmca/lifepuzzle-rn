import React from 'react';
import Toast from 'react-native-toast-message';
import {ContentContainer} from '../container/ContentContainer';
import {SvgIcon} from './SvgIcon';
import {BodyTextB} from './Text';
import {Color} from '../../../constants/color.constant';

export const showToast = (message: string) => {
  Toast.show({
    type: 'success',
    text2: message,
    position: 'bottom',
  });
};
export const showInfoToast = (message: string) => {
  Toast.show({
    type: 'info',
    text2: message,
    position: 'bottom',
  });
};
export const showErrorToast = (message: string) => {
  Toast.show({
    type: 'error',
    text2: message,
    position: 'bottom',
  });
};
const toastConfig = {
  success: ({text2 = ''}) => (
    <ContentContainer paddingHorizontal={20}>
      <ContentContainer
        paddingHorizontal={14}
        paddingVertical={12}
        useHorizontalLayout
        backgroundColor={Color.GREY_600}
        borderRadius={6}
        height="44"
        justifyContent="flex-start"
        gap={4}>
        <SvgIcon name={'success'}></SvgIcon>
        <BodyTextB color={Color.WHITE}>{text2}</BodyTextB>
      </ContentContainer>
    </ContentContainer>
  ),
  error: props => (
    <ContentContainer paddingHorizontal={20}>
      <ContentContainer
        paddingHorizontal={14}
        paddingVertical={12}
        useHorizontalLayout
        backgroundColor={Color.GREY_600}
        borderRadius={6}
        height="44"
        justifyContent="flex-start"
        gap={4}>
        <SvgIcon name={'error'}></SvgIcon>
        <BodyTextB color={Color.WHITE}>{props.text2}</BodyTextB>
      </ContentContainer>
    </ContentContainer>
  ),
  info: props => (
    <ContentContainer paddingHorizontal={20}>
      <ContentContainer
        paddingHorizontal={14}
        paddingVertical={12}
        useHorizontalLayout
        backgroundColor={Color.GREY_600}
        borderRadius={6}
        height="44"
        justifyContent="flex-start">
        <BodyTextB color={Color.WHITE}>{props.text2}</BodyTextB>
      </ContentContainer>
    </ContentContainer>
  ),
};
export const ToastComponent = () => {
  return <Toast config={toastConfig} />;
};
