import React from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../../navigation/types.tsx';
import { ContentContainer } from '../layout/ContentContainer';
import { TopNavigationContainer } from '../layout/TopNavigationContainer';
import { SvgIcon } from '../display/SvgIcon.tsx';
import { Title } from '../base/TextBase.tsx';

import { useAuthStore } from '../../../stores/auth.store';

type Props = {
  logo?: boolean;
  customGoBackAction?: () => void;
  title?: string;
  right?: React.ReactElement;
};

export const TopBar = ({
  title = '',
  right,
  customGoBackAction,
}: Props): React.ReactElement => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <TopNavigationContainer>
      <ContentContainer
        useHorizontalLayout
        paddingVertical={13}
        paddingHorizontal={13}
        height={50}
      >
        <Pressable
          onPress={() => {
            if (typeof customGoBackAction === 'function') {
              customGoBackAction();
            } else {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            }
          }}
        >
          <SvgIcon name={'chevronLeft'} />
        </Pressable>
        <Title>{title}</Title>
        {right ? right : <ContentContainer width={24} />}
      </ContentContainer>
    </TopNavigationContainer>
  );
};

export const MainTopBar = ({
  customGoBackAction,
  right,
}: Props): React.ReactElement => {
  const navigation = useNavigation<BasicNavigationProps>();
  const isLoggedIn = useAuthStore(state => state.isLoggedIn());
  return (
    <TopNavigationContainer>
      <ContentContainer
        useHorizontalLayout
        paddingVertical={13}
        paddingHorizontal={16}
        height={50}
      >
        <Pressable
          onPress={() => {
            if (typeof customGoBackAction === 'function') {
              customGoBackAction();
            } else {
              navigation.navigate('HomeTab', { screen: 'Home' });
            }
          }}
        >
          <SvgIcon size={99} name={'logo'} />
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
                }}
              >
                <SvgIcon name={'book'} />
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
                  navigation.navigate('HomeTab', { screen: 'Profile' });
                }
              }}
            >
              <SvgIcon name={'my'} />
            </Pressable>
          </ContentContainer>
        )}
      </ContentContainer>
    </TopNavigationContainer>
  );
};
