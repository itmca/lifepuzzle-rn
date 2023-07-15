import React from 'react';
import HomePage from '../../pages/Home/HomePage';
import ProfilePage from '../../pages/Profile/ProfilePage';
import PuzzleWritingQuestionPage from '../../pages/PuzzleWritingQuestion/PuzzleWritingQuestionPage';
import WritingHeaderLeft from '../../components/header/WritingHeaderLeft';
import WritingHeaderRight from '../../components/header/WritingHeaderRight';
import {useRecoilValue} from 'recoil';
import {isLoggedInState} from '../../recoils/auth.recoil';
import StoryListPage from '../../pages/StoryList/StoryListPage';
import Title from '../../components/styled/components/Title';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NavigationBar from '../../components/navigation/NavigationBar';

export type HomeTabParamList = {
  Home: undefined;
  PuzzleWritingQuestion: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<HomeTabParamList>();

const HomeTabNavigator = (): JSX.Element => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: () => <NavigationBar />,
      }}>
      <Stack.Screen
        name="Home"
        component={isLoggedIn ? StoryListPage : HomePage}
      />
      <Stack.Screen
        name="PuzzleWritingQuestion"
        component={PuzzleWritingQuestionPage}
        options={{
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
      <Stack.Screen name="Profile" component={ProfilePage} />
    </Stack.Navigator>
  );
};

export default HomeTabNavigator;
