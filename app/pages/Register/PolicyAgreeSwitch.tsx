import React from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Color} from '../../constants/color.constant';
import {CheckBox} from '../../components/styled/components/CheckBox.tsx';
import {BodyTextM} from '../../components/styled/components/Text.tsx';

type Props = {
  style?: ViewStyle;
  type: 'service' | 'privacy';
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};
export const PolicyAgreeSwitch = ({
  style,
  type,
  checked,
  onCheckedChange,
}: Props) => {
  const navigation = useNavigation();
  const policyName =
    type === 'service' ? '서비스 이용 약관' : '개인정보 처리 방침';
  const screenName = type === 'service' ? 'ServicePolicy' : 'PrivacyPolicy';

  const onPress = () => {
    navigation.navigate('NoTab', {
      screen: 'PolicyNavigator',
      params: {
        screen: screenName,
        params: {
          settingAgree: (checked: boolean) => {
            onCheckedChange(checked);
          },
        },
      },
    });
  };

  return (
    <TouchableOpacity
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 32,
        ...style,
      }}
      onPress={onPress}>
      <CheckBox
        label={
          <>
            <BodyTextM color={Color.MAIN}>(필수)</BodyTextM>
            <BodyTextM>{policyName} 동의합니다.</BodyTextM>
          </>
        }
        checked={checked}
        onChange={onPress}
        disableBuiltInState></CheckBox>
    </TouchableOpacity>
  );
};
