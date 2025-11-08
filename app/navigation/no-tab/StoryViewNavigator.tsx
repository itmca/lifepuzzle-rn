import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StoryDetailPage from '../../pages/Story/StoryDetail/StoryDetailPage';
import {TopBar} from '../../components/styled/components/TopBar';
import DetailViewHeaderRight from '../../components/header/DetailViewHeaderRight';
import StoryListPage from '../../pages/Story/StoryList/StoryListPage';

export type StoryViewParamList = {
  StoryList: undefined;
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
        name="StoryList"
        component={StoryListPage}
        options={{
          header: () => <TopBar title={'사진 목록'} />,
        }}
      />
      <Stack.Screen
        name="Story"
        component={StoryDetailPage}
        options={{
          header: () => (
            <TopBar title={'자세히 보기'} right={<DetailViewHeaderRight />} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default StoryViewNavigator;
