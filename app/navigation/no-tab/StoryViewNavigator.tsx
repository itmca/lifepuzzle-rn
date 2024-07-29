import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StoryDetailPage from '../../pages/StoryDetail/StoryDetailPage';
import GoBackHeaderLeft from '../../components/header/GoBackHeaderLeft';
import StoryDetailPageWithoutLogin from '../../pages/StoryDetail/StoryDetailPageWithoutLogin';
import DetailViewHeader from '../../components/header/DetailViewHeader';

export type StoryViewParamList = {
  Story: undefined;
  StoryDetailWithoutLogin: undefined;
};

const Stack = createNativeStackNavigator<StoryViewParamList>();

const StoryViewNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName="Story"
      screenOptions={{
        headerShadowVisible: true,
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="Story"
        component={StoryDetailPage}
        options={{
          title: '',
          header: () => <DetailViewHeader />,
        }}
      />
      <Stack.Screen
        name="StoryDetailWithoutLogin"
        component={StoryDetailPageWithoutLogin}
        options={{
          title: '',
          headerLeft: () => (
            <GoBackHeaderLeft iconType={'chevron-left'} iconSize={26} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default StoryViewNavigator;
