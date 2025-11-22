import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StoryDetailPage from '../../pages/StoryPages/Story/StoryDetailPage';
import { TopBar } from '../../components/ui/navigation/TopBar';
import DetailViewHeaderRight from '../../components/ui/navigation/header/DetailViewHeaderRight';
import GalleryListPage from '../../pages/GalleryPages/GalleryList/GalleryListPage.tsx';
import { STORY_VIEW_SCREENS } from '../screens.constant';

export type StoryViewParamList = {
  [STORY_VIEW_SCREENS.STORY_LIST]: undefined;
  [STORY_VIEW_SCREENS.STORY]: undefined;
  [STORY_VIEW_SCREENS.STORY_DETAIL_WITHOUT_LOGIN]: undefined;
};

const Stack = createNativeStackNavigator<StoryViewParamList>();

const StoryViewNavigator = (): React.ReactElement => {
  return (
    <Stack.Navigator
      initialRouteName={STORY_VIEW_SCREENS.STORY}
      screenOptions={{
        headerShadowVisible: true,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name={STORY_VIEW_SCREENS.STORY_LIST}
        component={GalleryListPage}
        options={{
          header: () => <TopBar title={'사진 목록'} />,
        }}
      />
      <Stack.Screen
        name={STORY_VIEW_SCREENS.STORY}
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
