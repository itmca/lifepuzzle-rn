import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TopBar} from '../../components/styled/components/TopBar';
import DetailViewHeaderRight from '../../components/header/DetailViewHeaderRight';
// import AiPhotoListPage from '../../pages/AiPhotoList/AiPhotoListPage';
import AiPhotoMakerPage from '../../pages/AiPhotoMaker/AiPhotoMakerPage';

export type AiPhotoParamList = {
  AiPhotoList: undefined;
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
      {/* 
      <Stack.Screen
        name="AiPhotoList"
        component={AiPhotoListPage}
        options={{
          header: () => <TopBar title={'AI포토 작업내역'} />,
        }}
      />
      */}
    </Stack.Navigator>
  );
};

export default AiPhotoNavigator;
