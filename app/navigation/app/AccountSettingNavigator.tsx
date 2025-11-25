import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountProfileSelectorPage from '../../pages/AccountPages/AccountProfileSelector/AccountProfileSelectorPage.tsx';
import WritingHeaderRight from '../../components/ui/navigation/header/WritingHeaderRight';
import { useNavigation } from '@react-navigation/native';

import { useSelectionStore } from '../../stores/selection.store';
import { useUserStore } from '../../stores/user.store';
import AccountSettingPage from '../../pages/AccountPages/AccountSetting/AccountSettingPage.tsx';
import { TopBar } from '../../components/ui/navigation/TopBar';
import { TouchableOpacity } from 'react-native';
import { BodyTextM } from '../../components/ui/base/TextBase';
import { Color } from '../../constants/color.constant.ts';
import { useLogout } from '../../service/auth/logout.hook.ts';
import { ACCOUNT_SETTING_SCREENS } from '../screens.constant';

export type AccountSettingParamList = {
  [ACCOUNT_SETTING_SCREENS.ACCOUNT_SETTING]: undefined;
  [ACCOUNT_SETTING_SCREENS.ACCOUNT_PROFILE_SELECTOR]: undefined;
  [ACCOUNT_SETTING_SCREENS.ACCOUNT_PASSWORD_MODIFICATION]: undefined;
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

  const { resetSelectedUserPhoto } = useSelectionStore();

  return (
    <Stack.Navigator
      initialRouteName={ACCOUNT_SETTING_SCREENS.ACCOUNT_SETTING}
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name={ACCOUNT_SETTING_SCREENS.ACCOUNT_SETTING}
        component={AccountSettingPage}
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
        }}
      />
      <Stack.Screen
        name={ACCOUNT_SETTING_SCREENS.ACCOUNT_PROFILE_SELECTOR}
        component={AccountProfileSelectorPage}
        options={{
          header: () => (
            <TopBar
              customGoBackAction={() => {
                resetSelectedUserPhoto();
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              title={'프로필 사진 선택'}
              right={
                <WritingHeaderRight
                  text="확인"
                  customAction={() => {
                    setModifyingUser({
                      ...modifyingUser,
                      modifiedImage: selectedUserPhoto,
                      isProfileImageUpdate: true,
                    });
                    resetSelectedUserPhoto();
                    navigation.goBack();
                  }}
                />
              }
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default AccountSettingNavigator;
