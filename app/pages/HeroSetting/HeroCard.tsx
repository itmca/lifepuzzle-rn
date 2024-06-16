import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {HeroType, HeroWithPuzzleCntType} from '../../types/hero.type';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {heroState} from '../../recoils/hero.recoil';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {HeroAvatar} from '../../components/avatar/HeroAvatar';
import {BasicNavigationProps} from '../../navigation/types';
import Text, {
  MediumText,
  SmallText,
  XSmallText,
  XXXLargeText,
} from '../../components/styled/components/Text';
import {MediumButton} from '../../components/styled/components/Button';
import {writingHeroKeyState} from '../../recoils/hero-write.recoil';
import {Color} from '../../constants/color.constant';
import {Photo} from '../../components/styled/components/Image';
import {userState} from '../../recoils/user.recoil';

type Props = {
  hero: HeroWithPuzzleCntType;
  isButton?: boolean;
};

const HeroCard = ({hero, isButton}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  const [_, refetch] = useAuthAxios<void>({
    requestOption: {
      method: 'POST',
      url: '/user/hero/recent',
    },
    onResponseSuccess: () => {},
    disableInitialRequest: true,
  });

  const {imageURL, heroName, heroNickName, title, heroNo, puzzleCount, users} =
    hero;
  const [currentHero, setCurrentHero] = useRecoilState<HeroType>(heroState);
  const setWritingHeroNo = useSetRecoilState(writingHeroKeyState);
  const [isSelected, setSelected] = useState<boolean>(
    currentHero.heroNo === heroNo,
  );
  const currentUser = useRecoilValue(userState);

  useEffect(() => {
    setSelected(currentHero.heroNo === heroNo);
  }, [currentHero]);

  if (isButton) {
    return (
      <View style={styles.heroCardMainContainer}>
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
          <Photo
            width={58}
            height={42}
            source={require('../../assets/images/person_add_icon.png')}></Photo>
          <SmallText fontWeight={700} style={{marginTop: 11}}>
            주인공 추가
          </SmallText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.heroCardMainContainer}>
      <View style={styles.heroCardHeader}>
        <View style={{marginRight: 5}}>
          <XXXLargeText fontWeight={700} lineHeight={'40px'}>
            {heroNickName}
          </XXXLargeText>
        </View>
        <MediumText fontWeight={700} color={Color.FONT_GRAY}>
          {heroName}
        </MediumText>
        <View style={styles.settingButtonContainer}>
          <TouchableOpacity
            onPress={() => {
              setWritingHeroNo(heroNo);
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
            <Icon name={'cog'} size={24} color="#D0D0D0" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.heroCardContainer}>
        <Photo borderRadius={12} source={{uri: imageURL}} />
        <View
          style={[
            styles.heroInfoContainer,
            {backgroundColor: 'rgba(0,0,0,0.7)'},
          ]}>
          <View style={styles.heroInfoTextContainer}>
            <Text color={Color.WHITE} style={styles.heroTitle}>
              {title}
            </Text>
            <View style={styles.heroPhotoContainer}>
              <Photo
                style={styles.logoImage}
                width={16}
                height={16}
                source={require('../../assets/images/puzzle-onepiece.png')}
              />
              <XSmallText color={Color.WHITE}>{puzzleCount}개</XSmallText>
            </View>
          </View>

          <MediumButton
            width="52px"
            borderRadius="16px"
            marginBottom="0px"
            backgroundColor={isSelected ? Color.PRIMARY_LIGHT : '#D4F3FF'}
            onPress={() => {
              setCurrentHero(hero);
              refetch({
                data: {
                  heroNo,
                },
              });
            }}>
            {isSelected ? (
              <XSmallText color={Color.WHITE}>작성중</XSmallText>
            ) : (
              <XSmallText color={Color.PRIMARY_LIGHT}>선택</XSmallText>
            )}
          </MediumButton>
        </View>
      </View>
      <View>
        <XSmallText fontWeight={700}>연결 계정</XSmallText>
        <View style={styles.connectedUserContainer}>
          {users?.map((user, index) => {
            return (
              <View key={index} style={styles.connectedUser}>
                <HeroAvatar
                  style={{marginBottom: 6}}
                  imageURL={user.imageURL}
                  size={48}
                />
                {
                  <XSmallText
                    color={
                      user.userNo === currentUser.userNo
                        ? Color.PRIMARY_LIGHT
                        : Color.FONT_GRAY
                    }
                    fontWeight={700}>
                    {user.nickName}
                  </XSmallText>
                }
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default HeroCard;
