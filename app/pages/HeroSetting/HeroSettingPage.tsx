import React, {useEffect, useState} from 'react';

import {Dimensions, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import Carousel from 'react-native-snap-carousel';
import HeroCard from './HeroCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {HeroType} from '../../types/hero.type';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useUpdateObserver} from '../../service/hooks/update.hooks';
import {heroUpdate} from '../../recoils/update.recoil';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {HeroesQueryResponse} from '../../service/hooks/hero.query.hook';

const HeroSettingPage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const [heroes, setHeroes] = useState<HeroType[]>([]);
  const heroUpdateObserver = useUpdateObserver(heroUpdate);

  const [isLoading, fetchHeroes] = useAuthAxios<HeroesQueryResponse>({
    requestOption: {
      url: '/heroes',
    },
    onResponseSuccess: res => {
      setHeroes(res.heroes.map((item, i) => item.hero));
    },
    disableInitialRequest: false,
  });

  useEffect(() => {
    fetchHeroes({});
  }, [heroUpdateObserver]);

  return (
    <View style={styles.mainContainer}>
      <LoadingContainer isLoading={isLoading}>
        <View style={styles.carouselContainer}>
          <Carousel
            data={heroes}
            sliderWidth={windowWidth}
            sliderHeight={windowHeight}
            itemWidth={windowWidth * 0.8}
            itemHeight={windowHeight}
            layout={'default'}
            renderItem={({item: hero, index}: any) => {
              return <HeroCard hero={hero} />;
            }}
          />
        </View>
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              navigation.push('NoTab', {
                screen: 'HeroSettingNavigator',
                params: {
                  screen: 'HeroRegister',
                },
              });
            }}>
            <Icon name={'user-plus'} size={24} style={styles.addButtonIcon} />
          </TouchableOpacity>
        </View>
      </LoadingContainer>
    </View>
  );
};

export default HeroSettingPage;
