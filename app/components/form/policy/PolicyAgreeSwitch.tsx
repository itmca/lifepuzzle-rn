import React from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {Text, TouchableOpacity, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { SmallText,LargeText } from "../../styled/components/Text";

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
    type === 'service' ? '서비스 이용약관' : '개인정보처리방침';
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
        size={18}
        iconStyle={{borderColor: '#343666', borderRadius: 4}}
        fillColor={'#343666'}
        disableBuiltInState={true}
        isChecked={checked}
        onPress={onPress}
      />
      <SmallText style={{marginLeft: -8}}>{policyName} 동의합니다.</SmallText>
    </TouchableOpacity>
  );
};
