import React from 'react';
import {Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../../navigation/types.tsx';
import {ContentContainer} from '../container/ContentContainer';
import {TopNavigationContainer} from '../container/TopNavigationContainer';
import {SvgIcon} from './SvgIcon.tsx';
Title;
import {Title} from './Text.tsx';
import {useRecoilValue} from 'recoil';
import {isLoggedInState} from '../../../recoils/auth.recoil.ts';
type Props = {
  logo?: boolean;
  onBack?: Function;
  title?: string;
  right?: JSX.Element;
};

export const TopBar = ({title = '', right, onBack}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <TopNavigationContainer>
      <ContentContainer
        useHorizontalLayout
        paddingVertical={13}
        paddingHorizontal={13}
        height="50">
        <Pressable
          onPress={() => {
            onBack && onBack();
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}>
          <SvgIcon name={'chevronLeft'}></SvgIcon>
        </Pressable>
        <Title>{title}</Title>
        {right ? right : <ContentContainer width={'24px'} />}
      </ContentContainer>
    </TopNavigationContainer>
  );
};
export const MainTopBar = ({onBack, right}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const isLoggedIn = useRecoilValue(isLoggedInState);
  return (
    <TopNavigationContainer>
      <ContentContainer
        useHorizontalLayout
        paddingVertical={13}
        paddingHorizontal={16}
        height="50">
        <Pressable
          onPress={() => {
            onBack && onBack();
            navigation.navigate('HomeTab', {screen: 'Home'});
          }}>
          <SvgIcon size={99} name={'logo'}></SvgIcon>
        </Pressable>
        {right ? (
          right
        ) : (
          <ContentContainer useHorizontalLayout width={'auto'}>
            {isLoggedIn && (
              <Pressable
                onPress={() => {
                  navigation.push('NoTab', {
                    screen: 'HeroSettingNavigator',
                    params: {
                      screen: 'HeroSetting',
                    },
                  });
                }}>
                <SvgIcon name={'book'}></SvgIcon>
              </Pressable>
            )}
            <Pressable
              onPress={() => {
                if (isLoggedIn) {
                  navigation.push('NoTab', {
                    screen: 'AccountSettingNavigator',
                    params: {
                      screen: 'AccountModification',
                    },
                  });
                } else {
                  navigation.navigate('HomeTab', {screen: 'Profile'});
                }
              }}>
              <SvgIcon name={'my'}></SvgIcon>
            </Pressable>
          </ContentContainer>
        )}
      </ContentContainer>
    </TopNavigationContainer>
  );
};
