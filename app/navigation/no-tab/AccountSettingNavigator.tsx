import * as React from 'react';
import GoBackHeaderLeft from '../../components/ui/navigation/header/GoBackHeaderLeft';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AccountProfileSelectorPage from '../../pages/AccountPages/AccountProfileSelector/AccountProfileSelectorPage.tsx';
import WritingHeaderRight from '../../components/ui/navigation/header/WritingHeaderRight';
import {useNavigation} from '@react-navigation/native';
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil';
import {selectionState} from '../../recoils/ui/selection.recoil';
import {writingUserState} from '../../recoils/auth/user.recoil';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import AccountModificationPage from '../../pages/AccountPages/AccountModification/AccountModificationPage';
import {TopBar} from '../../components/ui/navigation/TopBar';
import {TouchableOpacity} from 'react-native';
import {BodyTextM, Title} from '../../components/ui/base/TextBase';
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
  const [selection, setSelection] = useRecoilState(selectionState);
  const [modifyingUser, setModifyingUser] = useRecoilState(writingUserState);
  const seletedUserPhoto = selection.user;

  const resetSelectedUserPhoto = () =>
    setSelection(prev => ({...prev, user: undefined}));
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
