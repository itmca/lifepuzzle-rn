import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TopBar} from '../../components/styled/components/TopBar';
import AiPhotoWorkHistoryPage from '../../pages/AiPhotoPages/AiPhotoHistory/AiPhotoWorkHistoryPage';
import AiPhotoMakerPage from '../../pages/AiPhotoPages/AiPhotoMaker/AiPhotoMakerPage';

export type AiPhotoParamList = {
  AiPhotoWorkHistory: undefined;
  AiPhoto: undefined;
};

const Stack = createNativeStackNavigator<AiPhotoParamList>();

const AiPhotoNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName="AiPhoto"
      screenOptions={{
        headerShadowVisible: true,
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="AiPhoto"
        component={AiPhotoMakerPage}
        options={{
          header: () => <TopBar title={'AI포토 만들기'} />,
        }}
      />
      <Stack.Screen
        name="AiPhotoWorkHistory"
        component={AiPhotoWorkHistoryPage}
        options={{
          header: () => <TopBar title={'AI포토 작업 내역'} />,
        }}
      />
    </Stack.Navigator>
  );
};

export default AiPhotoNavigator;
