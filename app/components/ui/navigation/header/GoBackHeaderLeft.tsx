import React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Color } from '../../../../constants/color.constant';

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
}: Props): React.ReactElement => {
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
          navigation.navigate('App', {
            screen: 'Home',
          });
        }
      }}
      style={containerStyle}
    >
      <View style={{ marginLeft: -10 }}>
        <Icon name={iconType} size={iconSize} color={Color.GREY_300} />
      </View>
    </Pressable>
  );
};

export default GoBackHeaderLeft;
