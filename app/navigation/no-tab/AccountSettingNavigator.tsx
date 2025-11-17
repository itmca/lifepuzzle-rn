import * as React from 'react';
import GoBackHeaderLeft from '../../components/ui/navigation/header/GoBackHeaderLeft';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountProfileSelectorPage from '../../pages/AccountPages/AccountProfileSelector/AccountProfileSelectorPage.tsx';
import WritingHeaderRight from '../../components/ui/navigation/header/WritingHeaderRight';
import { useNavigation } from '@react-navigation/native';

import { useSelectionStore } from '../../stores/selection.store';
import { useUserStore } from '../../stores/user.store';
import AccountModificationPage from '../../pages/AccountPages/AccountModification/AccountModificationPage';
import { TopBar } from '../../components/ui/navigation/TopBar';
import { TouchableOpacity } from 'react-native';
import { BodyTextM, Title } from '../../components/ui/base/TextBase';
import { Color } from '../../constants/color.constant.ts';
import { useLogout } from '../../service/auth/logout.hook.ts';

export type AccountSettingParamList = {
  AccountModification: undefined;
  AccountSelectingPhoto: undefined;
  AccountPasswordModification: undefined;
};

const Stack = createNativeStackNavigator<AccountSettingParamList>();

const AccountSettingNavigator = (): React.ReactElement => {
  // 글로벌 상태 관리 (Zustand)
  const selectedUserPhoto = useSelectionStore(state => state.selectedUserPhoto);
  const modifyingUser = useUserStore(state => state.writingUser);
  const setModifyingUser = useUserStore(state => state.setWritingUser);

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation();

  // Custom hooks
  const logout = useLogout();

  // Custom functions
  const resetSelectedUserPhoto = () =>
    setSelection(prev => ({ ...prev, user: undefined }));

  return (
    <Stack.Navigator
      initialRouteName="AccountModification"
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
      }}
    >
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
        component={AccountProfileSelectorPage}
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
