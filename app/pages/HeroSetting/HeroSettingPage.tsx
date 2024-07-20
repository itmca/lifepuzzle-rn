import React, {useEffect, useState} from 'react';

import {Dimensions} from 'react-native';
import HeroCard from './HeroCard';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {HeroWithPuzzleCntType} from '../../types/hero.type';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useUpdateObserver} from '../../service/hooks/update.hooks';
import {heroUpdate} from '../../recoils/update.recoil';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {HeroesQueryResponse} from '../../service/hooks/hero.query.hook';
import Carousel from 'react-native-reanimated-carousel';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer.tsx';
import {ContentContainer} from '../../components/styled/container/ContentContainer.tsx';

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
    <LoadingContainer isLoading={isLoading}>
      <ScreenContainer>
        <ContentContainer alignCenter>
          <Carousel
            data={[...heroes, {isButton: true}]}
            width={windowWidth}
            renderItem={({item}: any) => {
              return <HeroCard hero={item} isButton={item.isButton} />;
            }}
          />
        </ContentContainer>
      </ScreenContainer>
    </LoadingContainer>
  );
};

export default HeroSettingPage;
