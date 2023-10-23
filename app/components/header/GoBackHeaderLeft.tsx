import React from 'react';
import {
  Pressable,
  StyleProp,
  TextStyle,
  Vibration,
  View,
  ViewStyle,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Color} from '../../constants/color.constant';

type Props = {
  iconType?: 'x' | 'chevron-left';
  containerStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
  customAction?: Function;
};

const GoBackHeaderLeft = ({
  iconType = 'x',
  containerStyle,
  iconSize = 26,
  customAction,
}: Props): JSX.Element => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        if (typeof customAction === 'function') {
          customAction();
        }

        navigation.goBack();
      }}
      style={containerStyle}>
      <View style={{marginLeft: -10}}>
        <Icon name={iconType} size={iconSize} color={Color.FONT_GRAY} />
      </View>
    </Pressable>
  );
};

export default GoBackHeaderLeft;
