import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TopBar } from '../../components/ui/navigation/TopBar';
import { AiPhotoWorkHistoryPage } from '../../pages/AiPhotoPages/AiPhotoHistory/AiPhotoWorkHistoryPage';
import { AiPhotoMakerPage } from '../../pages/AiPhotoPages/AiPhotoMaker/AiPhotoMakerPage';
import { AI_PHOTO_SCREENS } from '../screens.constant';

export type AiPhotoParamList = {
  [AI_PHOTO_SCREENS.AI_PHOTO_WORK_HISTORY]: undefined;
  [AI_PHOTO_SCREENS.AI_PHOTO]: undefined;
};

const Stack = createNativeStackNavigator<AiPhotoParamList>();

const AiPhotoNavigator = (): React.ReactElement => {
  return (
    <Stack.Navigator
      initialRouteName={AI_PHOTO_SCREENS.AI_PHOTO}
      screenOptions={{
        headerShadowVisible: true,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name={AI_PHOTO_SCREENS.AI_PHOTO}
        component={AiPhotoMakerPage}
        options={{
          header: () => <TopBar title={'AI포토 만들기'} />,
        }}
      />
      <Stack.Screen
        name={AI_PHOTO_SCREENS.AI_PHOTO_WORK_HISTORY}
        component={AiPhotoWorkHistoryPage}
        options={{
          header: () => <TopBar title={'AI포토 작업 내역'} />,
        }}
      />
    </Stack.Navigator>
  );
};

export { AiPhotoNavigator };
