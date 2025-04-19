import * as React from 'react';
import GoBackHeaderLeft from '../../components/header/GoBackHeaderLeft';
import AccountPasswordModificationPage from '../../pages/AccountPasswordModification/AccountPasswordModificationPage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Title from '../../components/styled/components/Title';
import AccountSelectingPhotoPage from '../../pages/AccountSelectingPhoto/AccountSelectingPhotoPage';
import WritingHeaderRight from '../../components/header/WritingHeaderRight';
import {useNavigation} from '@react-navigation/native';
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil';
import {
  selectedUserPhotoState,
  writingUserState,
} from '../../recoils/user.recoil';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import AccountModificationPage from '../../pages/AccountModification/AccountModificationPage';
import {TopBar} from '../../components/styled/components/TopBar.tsx';

export type AccountSettingParamList = {
  AccountModification: undefined;
  AccountSelectingPhoto: undefined;
  AccountPasswordModification: undefined;
};

const Stack = createNativeStackNavigator<AccountSettingParamList>();

const AccountSettingNavigator = (): JSX.Element => {
  const navigation = useNavigation();
  const resetSelectedUserPhoto = useResetRecoilState(selectedUserPhotoState);
  const resetWritingUser = useResetRecoilState(writingUserState);
  const [modifyingUser, setModifyingUser] = useRecoilState(writingUserState);
  const seletedUserPhoto: PhotoIdentifier | undefined = useRecoilValue(
    selectedUserPhotoState,
  );
  return (
    <Stack.Navigator
      initialRouteName="AccountModification"
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="AccountModification"
        component={AccountModificationPage}
        options={{
          // TODO(jung.jooon): 시은님 PR(#207) 머지 완료 후 right에 로그아웃 버튼 추가
          header: () => <TopBar title={'회원 정보'} />,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="AccountPasswordModification"
        component={AccountPasswordModificationPage}
        options={{
          headerLeft: () => (
            <GoBackHeaderLeft
              iconType={'chevron-left'}
              customAction={() => {
                resetWritingUser();
              }}
            />
          ),
          headerTitle: () => <Title>비밀번호 수정</Title>,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="AccountSelectingPhoto"
        component={AccountSelectingPhotoPage}
        options={{
          headerLeft: () => (
            <GoBackHeaderLeft
              iconType="chevron-left"
              customAction={() => {
                resetSelectedUserPhoto();
              }}
            />
          ),
          headerTitle: () => <Title>주인공 사진 선택</Title>,
          headerBackVisible: false,
          headerRight: () => (
            <WritingHeaderRight
              text="확인"
              customAction={() => {
                setModifyingUser({
                  ...modifyingUser,
                  modifiedImage: seletedUserPhoto,
                  isProfileImageUpdate: true,
                });

                resetSelectedUserPhoto();
                navigation.goBack();
              }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default AccountSettingNavigator;
