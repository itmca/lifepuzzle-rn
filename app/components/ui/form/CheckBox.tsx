import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {SvgIcon} from '../display/SvgIcon.tsx';
import {BodyTextM} from '../base/TextBase.tsx';

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
  const [_checked, setChecked] = useState<boolean>(checked ?? false);
  const onPress = () => {
    const newChecked = !_checked;

    if (onChange) {
      onChange(newChecked);
    }

    if (!disableBuiltInState) {
      setChecked(newChecked);
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
        <SvgIcon name="checkRoundOn" />
      ) : (
        <SvgIcon name="checkRoundOff" />
      )}
      {typeof label === 'string' ? <BodyTextM>{label}</BodyTextM> : label}
    </TouchableOpacity>
  );
};
