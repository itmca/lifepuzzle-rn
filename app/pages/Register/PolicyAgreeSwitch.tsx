import React from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {TouchableOpacity, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MediumText from '../../components/styled/components/LegacyText.tsx';
import {LegacyColor} from '../../constants/color.constant';

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
      <BouncyCheckbox
        size={16}
        innerIconStyle={{
          borderColor: checked
            ? LegacyColor.PRIMARY_LIGHT
            : LegacyColor.FONT_GRAY,
          borderRadius: 1,
        }}
        checkIconImageSource={require('../../assets/images/check.png')}
        fillColor={'transparent'}
        disableBuiltInState={true}
        isChecked={checked}
        onPress={onPress}
      />
      <MediumText
        style={{
          marginLeft: -8,
          color: checked ? LegacyColor.BLACK : LegacyColor.FONT_GRAY,
        }}>
        {policyName} 동의합니다.
      </MediumText>
    </TouchableOpacity>
  );
};
