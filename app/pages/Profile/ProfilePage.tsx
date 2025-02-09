import React from 'react';
import {useRecoilValue} from 'recoil';
import {userState} from '../../recoils/user.recoil';
import {isLoggedInState} from '../../recoils/auth.recoil';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {MediumText} from '../../components/styled/components/LegacyText.tsx';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {Color} from '../../constants/color.constant';
import {ProfileMenuListItem} from './ProfileMenuListItem';
import {Divider} from '../../components/styled/components/Divider.tsx';
import {LargeTitle} from '../../components/styled/components/Title.tsx';
import {AccountAvatar} from '../../components/avatar/AccountAvatar.tsx';

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

  return (
    <ScreenContainer justifyContent={'flex-start'} gap={0}>
      <ContentContainer
        useHorizontalLayout
        withScreenPadding
        paddingVertical={32}>
        <AccountAvatar
          nickName={user.userNickName}
          imageURL={user.imageURL}
          size={80}
        />
        <ContentContainer gap={8}>
          <LargeTitle color={Color.LIGHT_BLACK}>{user.userNickName}</LargeTitle>
          {user.userId && (
            <MediumText color={Color.FONT_DARK}>{user.userId}</MediumText>
          )}
        </ContentContainer>
      </ContentContainer>
      <ContentContainer paddingHorizontal={20}>
        <Divider />
      </ContentContainer>
      <ContentContainer gap={0}>
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
      </ContentContainer>
    </ScreenContainer>
  );
};
export default ProfilePage;
