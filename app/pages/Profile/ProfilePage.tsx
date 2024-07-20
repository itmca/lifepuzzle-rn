import React from 'react';

import {View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {userState} from '../../recoils/user.recoil';
import {isLoggedInState} from '../../recoils/auth.recoil';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {styles} from './styles';
import {BasicNavigationProps} from '../../navigation/types';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {MediumText, XXLargeText} from '../../components/styled/components/Text';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {Color} from '../../constants/color.constant';
import Image from '../../components/styled/components/Image';
import {ProfileMenuListItem} from './ProfileMenuListItem';

const ProfilePage = (): JSX.Element | null => {
  const navigation = useNavigation<BasicNavigationProps>();
  const isLoggedIn = useRecoilValue(isLoggedInState);

  useFocusEffect(() => {
    if (!isLoggedIn) {
      navigation.push('NoTab', {
        screen: 'LoginRegisterNavigator',
        params: {
          screen: 'LoginMain',
        },
      });
    }
  });

  const user = useRecoilValue(userState);
  if (!user || user.userNo == -1) {
    return null;
  }

  console.log(user);

  return (
    <ScreenContainer justifyContent={'flex-start'} gap={0}>
      <ContentContainer
        useHorizontalLayout
        withScreenPadding
        gap={20}
        paddingVertical={32}>
        <Image
          width={60}
          height={60}
          borderRadius={30}
          resizeMode={'cover'}
          source={
            typeof user.imageURL === 'string'
              ? {uri: user.imageURL}
              : require('../../assets/images/profile_icon.png')
          }
        />
        <ContentContainer>
          <XXLargeText fontWeight={600} color={Color.LIGHT_BLACK}>
            {user.userNickName}
          </XXLargeText>
          {user.userId && (
            <MediumText fontWeight={500} color={Color.FONT_DARK}>
              {user.userId}
            </MediumText>
          )}
        </ContentContainer>
      </ContentContainer>
      <View style={styles.customDivider} />
      <ProfileMenuListItem
        listItemTitle={'계정 관리'}
        onPress={() => {
          navigation.push('NoTab', {
            screen: 'AccountSettingNavigator',
            params: {
              screen: 'AccountModification',
            },
          });
        }}
      />
      <ProfileMenuListItem
        backgroundColor={Color.WHITE_GRAY}
        listItemTitle={'주인공 관리'}
        onPress={() => {
          navigation.push('NoTab', {
            screen: 'HeroSettingNavigator',
            params: {
              screen: 'HeroSetting',
            },
          });
        }}
      />
    </ScreenContainer>
  );
};
export default ProfilePage;
