import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StoryDetailPage } from '../../pages/StoryPages/StoryDetail/StoryDetailPage';
import { TopBar } from '../../components/ui/navigation/TopBar';
import { DetailViewHeaderRight } from '../../components/ui/navigation/header/DetailViewHeaderRight';
import { STORY_VIEW_SCREENS } from '../screens.constant';

export type StoryViewParamList = {
  [STORY_VIEW_SCREENS.STORY]: {
    galleryIndex?: number;
  };
};

const Stack = createNativeStackNavigator<StoryViewParamList>();

// 공통 헤더 컴포넌트
const defaultHeader = () => (
  <TopBar title={'자세히 보기'} right={<DetailViewHeaderRight />} />
);

const StoryViewNavigator = (): React.ReactElement => {
  return (
    <Stack.Navigator
      initialRouteName={STORY_VIEW_SCREENS.STORY}
      screenOptions={{
        headerShadowVisible: true,
        headerTitleAlign: 'center',
        header: defaultHeader,
      }}
    >
      <Stack.Screen
        name={STORY_VIEW_SCREENS.STORY}
        component={StoryDetailPage}
      />
    </Stack.Navigator>
  );
};

export { StoryViewNavigator };
