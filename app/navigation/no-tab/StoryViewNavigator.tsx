import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StoryDetailPage from '../../pages/StoryDetail/StoryDetailPage';
import GoBackHeaderLeft from '../../components/header/GoBackHeaderLeft';
import StoryDetailPageWithoutLogin from '../../pages/StoryDetail/StoryDetailPageWithoutLogin';
import {TopBar} from '../../components/styled/components/TopBar';
import DetailViewHeaderRight from '../../components/header/DetailViewHeaderRight';

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
          header: () => (
            <TopBar title={'자세히 보기'} right={<DetailViewHeaderRight />} />
          ),
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
