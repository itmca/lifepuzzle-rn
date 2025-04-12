import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SvgIcon} from './SvgIcon.tsx';
import {BodyTextM} from './Text.tsx';

type Props = {
  label?: string | JSX.Element;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disableBuiltInState?: boolean;
};
export const CheckBox = ({
  label,
  checked = false,
  onChange,
  disableBuiltInState = false,
}: Props) => {
  const navigation = useNavigation();
  const [_checked, setChecked] = useState<boolean>(checked ?? false);
  const onPress = () => {
    if (onChange) onChange(_checked);
    if (!disableBuiltInState) {
      setChecked(!_checked);
    }
  };
  useEffect(() => {
    setChecked(checked);
  }, [checked]);
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      }}
      onPress={onPress}>
      {_checked ? (
        <SvgIcon name="checkRoundOn"></SvgIcon>
      ) : (
        <SvgIcon name="checkRoundOff"></SvgIcon>
      )}
      {typeof label === 'string' ? <BodyTextM>{label}</BodyTextM> : label}
    </TouchableOpacity>
  );
};
