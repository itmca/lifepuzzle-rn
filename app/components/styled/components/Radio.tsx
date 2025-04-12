import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SvgIcon} from './SvgIcon.tsx';
import {BodyTextB, BodyTextM} from './Text.tsx';
import {Color} from '../../../constants/color.constant.ts';
import {ContentContainer} from '../container/ContentContainer.tsx';

type Props = {
  selected?: boolean;
  label?: string | JSX.Element;
  value: string;
  onSelect?: (value: string) => void;
  subLabel?: string;
  disableBuiltInState?: boolean;
};
export const Radio = ({
  selected = false,
  label,
  value,
  onSelect,
  subLabel,
  disableBuiltInState = false,
}: Props) => {
  const navigation = useNavigation();
  const [_selected, setselected] = useState<boolean>(selected ?? false);
  const onPress = () => {
    if (onSelect) onSelect(value);
    if (!disableBuiltInState) {
      setselected(!_selected);
    }
  };
  useEffect(() => {
    setselected(selected);
  }, [selected]);
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        width: '100%',
      }}
      onPress={onPress}>
      {_selected ? (
        <SvgIcon name="radioOn"></SvgIcon>
      ) : (
        <SvgIcon name="radioOff"></SvgIcon>
      )}
      <ContentContainer
        useHorizontalLayout
        justifyContent="flex-start"
        alignItems="stretch"
        gap={12}>
        {typeof label === 'string' ? <BodyTextB>{label}</BodyTextB> : label}
        {subLabel && <BodyTextM color={Color.GREY_500}>{subLabel}</BodyTextM>}
      </ContentContainer>
    </TouchableOpacity>
  );
};
