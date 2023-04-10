import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {HeroType} from '../../types/hero.type';
import {useRecoilState} from 'recoil';
import {heroState} from '../../recoils/hero.recoil';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {HeroAvatar} from '../avatar/HeroAvatar';
import {BasicNavigationProps} from '../../navigation/types';

type Props = {
  hero: HeroType;
};

const HeroCard = ({hero}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  const [_, refetch] = useAuthAxios<void>({
    requestOption: {
      method: 'POST',
      url: '/user/hero/recent',
    },
    onResponseSuccess: () => {},
    disableInitialRequest: true,
  });

  const {imageURL, heroName, heroNickName, title, heroNo} = hero;
  const [currentHero, setCurrentHero] = useRecoilState<HeroType>(heroState);
  const [isSelected, setSelected] = useState<boolean>(
    currentHero.heroNo === heroNo,
  );

  useEffect(() => {
    setSelected(currentHero.heroNo === heroNo);
  }, [currentHero]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.settingButtonContainer}>
        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => {
            navigation.push('NoTab', {
              screen: 'HeroSettingNavigator',
              params: {
                screen: 'HeroModification',
                params: {
                  heroNo,
                },
              },
            });
          }}>
          <Icon name={'cog'} size={24} style={styles.settingButtonIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.characterProfileContainer}>
        <HeroAvatar size={128} imageURL={imageURL} />
        <Text style={styles.characterNickName}>{heroNickName}</Text>
        <Text style={styles.characterName}>{heroName} 님</Text>
        <Text style={styles.characterTitle}>{'"' + title + '"'}</Text>
      </View>
      <View style={styles.selectButtonContainer}>
        <TouchableOpacity
          style={isSelected ? styles.disabledSelectButton : styles.selectButton}
          disabled={isSelected}
          onPress={() => {
            setCurrentHero(hero);
            refetch({
              data: {
                heroNo,
              },
            });
          }}>
          <Text style={styles.selectButtonText}>
            {isSelected ? '작성 중인 주인공' : '선택하기'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeroCard;
