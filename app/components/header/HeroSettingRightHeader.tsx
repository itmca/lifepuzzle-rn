import React from 'react';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {ContentContainer} from '../styled/container/ContentContainer.tsx';
import {SvgIcon} from '../styled/components/SvgIcon.tsx';

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
        <SvgIcon name={'heroAdd'} />
      </TouchableOpacity>
    </ContentContainer>
  );
};

export default HeroSettingRightHeader;
