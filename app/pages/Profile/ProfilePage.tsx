import React from 'react';

import {TouchableOpacity, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {userState} from '../../recoils/user.recoil';
import {isLoggedInState} from '../../recoils/auth.recoil';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {styles} from './styles';
import {BasicNavigationProps} from '../../navigation/types';
import {
  ContentContainer,
  HorizontalContentContainer,
} from '../../components/styled/container/ContentContainer';
import {XXLargeText, MediumText} from '../../components/styled/components/Text';
import {NoOutLineScreenContainer} from '../../components/styled/container/ScreenContainer';
import {Color} from '../../constants/color.constant';
import Image from '../../components/styled/components/Image';

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

  const ListItem = ({
    backgroundColor = Color.WHITE,
    ListItemTitle,
    onPress,
  }: {
    backgroundColor?: string;
    ListItemTitle: string;
    onPress: () => void;
  }): JSX.Element => {
    return (
      <HorizontalContentContainer
        padding={16}
        alignItems="center"
        backgroundColor={backgroundColor}>
        <MediumText color={Color.FONT_DARK} fontWeight={500}>
          {ListItemTitle}
        </MediumText>
        <TouchableOpacity
          style={{
            borderRadius: 50,
            backgroundColor: Color.LIGHT_GRAY,
            marginLeft: 'auto',
          }}
          onPress={onPress}>
          <Icon
            disabled
            name={'chevron-right'}
            size={24}
            color={Color.FONT_GRAY}
          />
        </TouchableOpacity>
      </HorizontalContentContainer>
    );
  };

  return (
    <NoOutLineScreenContainer justifyContent={'flex-start'}>
      <HorizontalContentContainer alignItems="center" padding={38} gap={'20px'}>
        <Image
          width={60}
          height={60}
          source={require('../../assets/images/profile_icon.png')}
        />
        <ContentContainer>
          <XXLargeText fontWeight={600} color={Color.LIGHT_BLACK}>
            {user.userNickName}
          </XXLargeText>
          <MediumText fontWeight={500} color={Color.FONT_DARK}>
            {user.userId}
          </MediumText>
        </ContentContainer>
      </HorizontalContentContainer>
      <View style={styles.customDivider} />
      <ListItem
        ListItemTitle={'계정 관리'}
        onPress={() => {
          navigation.push('NoTab', {
            screen: 'AccountSettingNavigator',
            params: {
              screen: 'AccountModification',
            },
          });
        }}
      />
      <ListItem
        backgroundColor={Color.WHITE_GRAY}
        ListItemTitle={'주인공 관리'}
        onPress={() => {
          navigation.push('NoTab', {
            screen: 'HeroSettingNavigator',
            params: {
              screen: 'HeroSetting',
            },
          });
        }}
      />
    </NoOutLineScreenContainer>
  );
};
export default ProfilePage;
