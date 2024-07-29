import {TopNavigationContainer} from '../styled/container/TopNavigationContainer';
import SmallImage from '../styled/components/Image';
import React from 'react';
import {Pressable} from 'react-native';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {ContentContainer} from '../styled/container/ContentContainer.tsx';

type Props = {
  displayRight?: boolean;
};
const NavigationBar = ({displayRight = true}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  return (
    <TopNavigationContainer>
      <Pressable
        onPress={() => {
          navigation.navigate('HomeTab', {screen: 'Home'});
        }}>
        <SmallImage
          width={115}
          height={20}
          source={require('../../assets/images/app-title.png')}
        />
      </Pressable>
      {displayRight ? (
        <Pressable
          style={styles.goToAccountIcon}
          onPress={() => {
            navigation.navigate('HomeTab', {screen: 'Profile'});
          }}>
          <SmallImage
            source={require('../../assets/images/icon-profile.png')}
            width={30}
            height={30}
          />
        </Pressable>
      ) : (
        <ContentContainer height={'30px'} />
      )}
    </TopNavigationContainer>
  );
};

export default NavigationBar;
