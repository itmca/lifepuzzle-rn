import React, {useEffect, useState} from 'react';

import {Dimensions, View} from 'react-native';
import {styles} from './styles';
import Carousel from 'react-native-snap-carousel';
import HeroCard from './HeroCard';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {HeroWithPuzzleCntType} from '../../types/hero.type';
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

  const [heroes, setHeroes] = useState<HeroWithPuzzleCntType[]>([]);
  const heroUpdateObserver = useUpdateObserver(heroUpdate);

  const [isLoading, fetchHeroes] = useAuthAxios<HeroesQueryResponse>({
    requestOption: {
      url: '/heroes/v2',
    },
    onResponseSuccess: res => {
      setHeroes(
        res.heroes.map(item => ({
          ...item.hero,
          puzzleCount: item.puzzleCnt,
          users: item.users,
        })),
      );
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
            data={[...heroes, {isButton: true}]}
            sliderWidth={windowWidth}
            sliderHeight={windowHeight}
            itemWidth={windowWidth * 0.8}
            itemHeight={windowHeight}
            layout={'default'}
            renderItem={({item}: any) => {
              return <HeroCard hero={item} isButton={item.isButton} />;
            }}
          />
        </View>
      </LoadingContainer>
    </View>
  );
};

export default HeroSettingPage;
