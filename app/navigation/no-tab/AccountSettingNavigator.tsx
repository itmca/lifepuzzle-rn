import * as React from 'react';
import GoBackHeaderLeft from '../../components/header/GoBackHeaderLeft';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AccountSelectingPhotoPage from '../../pages/AccountPages/AccountSelectingPhoto/AccountSelectingPhotoPage';
import WritingHeaderRight from '../../components/header/WritingHeaderRight';
import {useNavigation} from '@react-navigation/native';
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil';
import {
  selectedUserPhotoState,
  writingUserState,
} from '../../recoils/user.recoil';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import AccountModificationPage from '../../pages/AccountPages/AccountModification/AccountModificationPage';
import {TopBar} from '../../components/styled/components/TopBar.tsx';
import {TouchableOpacity} from 'react-native';
import {BodyTextM, Title} from '../../components/styled/components/Text.tsx';
import {Color} from '../../constants/color.constant.ts';
import {useLogout} from '../../service/hooks/logout.hook.ts';

export type AccountSettingParamList = {
  AccountModification: undefined;
  AccountSelectingPhoto: undefined;
  AccountPasswordModification: undefined;
};

const Stack = createNativeStackNavigator<AccountSettingParamList>();

const AccountSettingNavigator = (): JSX.Element => {
  const navigation = useNavigation();
  const resetSelectedUserPhoto = useResetRecoilState(selectedUserPhotoState);
  const [modifyingUser, setModifyingUser] = useRecoilState(writingUserState);
  const seletedUserPhoto: PhotoIdentifier | undefined = useRecoilValue(
    selectedUserPhotoState,
  );
  const logout = useLogout();

  return (
    <Stack.Navigator
      initialRouteName="AccountModification"
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="AccountModification"
        component={AccountModificationPage}
        options={{
          header: () => (
            <TopBar
              title={'회원 정보'}
              right={
                <TouchableOpacity onPress={() => logout()}>
                  <BodyTextM color={Color.GREY_400}>로그아웃</BodyTextM>
                </TouchableOpacity>
              }
            />
          ),
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
