import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import styles from '../styles';
import HomePage from '../../pages/Home/HomePage';
import ProfilePage from '../../pages/Profile/ProfilePage';
import DefaultHeaderLeft from '../../components/header/DefaultHeaderLeft';
import HeroBadgeHeader from '../../components/header/HeroBadgeHeader';
import PuzzleWritingQuestionPage from '../../pages/PuzzleWritingQuestion/PuzzleWritingQuestionPage';
import WritingHeaderLeft from '../../components/header/WritingHeaderLeft';
import WritingHeaderRight from '../../components/header/WritingHeaderRight';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRecoilValue} from 'recoil';
import {isLoggedInState} from '../../recoils/auth.recoil';
import StoryListPage from '../../pages/StoryList/StoryListPage';
import Title from '../../components/styled/components/Title';

export type HomeTabParamList = {
    Home: undefined;
    PuzzleWritingQuestion: undefined;
    Profile: undefined;
}

const BottomTab = createBottomTabNavigator<HomeTabParamList>();

const HomeTabRootNavigator = (): JSX.Element => {
  const isLoggedIn = useRecoilValue(isLoggedInState);

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      backBehavior="history"
      screenOptions={{
        tabBarStyle: {
          height: 74,
          borderTopWidth: 0, // For IOS
          elevation: 0, // For Android
        },
        headerTitleAlign: 'center',
        headerLeftContainerStyle: {
          paddingLeft: 16,
        },
        headerRightContainerStyle: {
          paddingRight: 16,
        },
        headerStyle: {
          shadowColor: 'transparent',
          elevation: 0,
        },
        tabBarHideOnKeyboard: true,
      }}>
      <BottomTab.Screen
        name="Home"
        component={isLoggedIn ? StoryListPage : HomePage}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) =>
            isLoggedIn ? (
              <MaterialCommunityIcon
                name={focused ? 'book-open-page-variant' : 'book-outline'}
                size={24}
              />
            ) : (
              <MaterialCommunityIcon
                name={focused ? 'home' : 'home-outline'}
                size={24}
              />
            ),
          headerShown: false,
          headerLeft: () => <DefaultHeaderLeft />,
          title: '',
          headerRight: () => isLoggedIn && <HeroBadgeHeader />,
        }}
      />
      <BottomTab.Screen
        name="PuzzleWritingQuestion"
        component={PuzzleWritingQuestionPage}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: () => (
            <Image
              style={styles.imgPuzzleIcon}
              source={require('../../assets/images/puzzle-onepiece-round-filled.png')}
            />
          ),
          headerLeft: () => <WritingHeaderLeft type="cancel" />,
          headerTitle: () => <Title>조각 맞추기</Title>,
          headerRight: () => (
            <WritingHeaderRight
              text="다음"
              nextScreenName="PuzzleWritingDatePage"
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          title: '',
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcon
              name={focused === true ? 'account' : 'account-outline'}
              size={24}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default HomeTabRootNavigator;
