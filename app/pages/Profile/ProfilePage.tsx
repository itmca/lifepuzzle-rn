import React from 'react';

import {TouchableOpacity, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {userState} from '../../recoils/user.recoil';
import {isLoggedInState} from '../../recoils/auth.recoil';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Avatar, Divider, List} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {styles} from './styles';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {BasicNavigationProps} from '../../navigation/types';
import {
  ContentContainer,
  HorizontalContentContainer,
} from '../../components/styled/container/ContentContainer';
import {XXLargeText} from '../../components/styled/components/Text';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';

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

  if (!user) {
    return null;
  }

  function goToModificationPage() {
    return () => {
      navigation.push('NoTab', {
        screen: 'AccountSettingNavigator',
        params: {
          screen: 'AccountModification',
        },
      });
    };
  }

  return (
    <ScreenContainer justifyContent={'flex-start'}>
      <HorizontalContentContainer
        height={'40px'}
        alignItems="center"
        marginTop={'8px'}>
        <Avatar.Text size={40} label={user.userNickName.substr(0, 1)} />
        <XXLargeText>{user.userNickName} 님</XXLargeText>
        <TouchableOpacity
          style={styles.accountModificationButton}
          onPress={goToModificationPage()}>
          <Icon size={24} name={'chevron-right'} />
        </TouchableOpacity>
      </HorizontalContentContainer>
      <View style={styles.customDivider} />
      <ContentContainer gap="0px" style={{marginTop: -16}}>
        <List.Item
          style={{height: 80, justifyContent: 'center'}}
          title="공지사항"
          left={props => (
            <List.Icon {...props} style={styles.listItemIcon} icon="bell" />
          )}
          onPress={() => {
            CustomAlert.simpleAlert('공지사항이 없습니다.');
          }}
        />
        <Divider />
        <List.Item
          style={{height: 80, justifyContent: 'center'}}
          title="주인공 관리"
          left={props => (
            <List.Icon
              {...props}
              style={styles.listItemIcon}
              icon="account-supervisor"
            />
          )}
          onPress={() => {
            navigation.push('NoTab', {
              screen: 'HeroSettingNavigator',
              params: {
                screen: 'HeroSetting',
              },
            });
          }}
        />
        <Divider />
      </ContentContainer>
    </ScreenContainer>
  );
};
export default ProfilePage;
