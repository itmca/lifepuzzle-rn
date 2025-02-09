import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {ContentContainer} from '../styled/container/ContentContainer.tsx';
import {LegacyColor} from '../../constants/color.constant.ts';

const HeroSettingRightHeader = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <ContentContainer alignCenter width={'auto'}>
      <TouchableOpacity
        onPress={() => {
          navigation.push('NoTab', {
            screen: 'HeroSettingNavigator',
            params: {
              screen: 'HeroRegister',
            },
          });
        }}>
        <Icon size={32} name={'add-circle'} color={LegacyColor.PRIMARY_LIGHT} />
      </TouchableOpacity>
    </ContentContainer>
  );
};

export default HeroSettingRightHeader;
