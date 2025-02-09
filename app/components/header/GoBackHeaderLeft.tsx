import React from 'react';
import {Pressable, StyleProp, View, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {LegacyColor} from '../../constants/color.constant';

type Props = {
  iconType?: 'x' | 'chevron-left';
  containerStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
  customAction?: Function;
};

const GoBackHeaderLeft = ({
  iconType = 'chevron-left',
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

        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('HomeTab', {
            screen: 'Home',
          });
        }
      }}
      style={containerStyle}>
      <View style={{marginLeft: -10}}>
        <Icon name={iconType} size={iconSize} color={LegacyColor.FONT_GRAY} />
      </View>
    </Pressable>
  );
};

export default GoBackHeaderLeft;
