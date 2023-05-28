import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {styles} from './styles';
import CtaButton from '../../components/button/CtaButton';
import {useRecoilValue} from 'recoil';
import {userState} from '../../recoils/user.recoil';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {currentUserUpdate} from '../../recoils/update.recoil';
import {useUpdatePublisher} from '../../service/hooks/update.hooks';
import {useLogout} from '../../service/hooks/logout.hook';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {authState} from '../../recoils/auth.recoil';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ValidatedTextInput from '../../components/input/ValidatedTextInput';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {ScrollContainer} from '../../components/styled/container/ScrollContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer';

type AccountQueryResponse = {
  userNo: number;
  userId: string;
  userNickName: string;
  email: string;
  birthday: Date;
};
const AccountModificationPage = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList>): JSX.Element => {
  const logout = useLogout();
  const user = useRecoilValue(userState);
  const tokens = useRecoilValue(authState);
  const [id, setId] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [originNickName, setOriginNickName] = useState<string>('');
  const [nickNameError, setNickNameError] = useState<boolean>(false);
  const publishUserUpdate = useUpdatePublisher(currentUserUpdate);

  const [queryLoading] = useAuthAxios<AccountQueryResponse>({
    requestOption: {
      url: `/users/${String(user?.userNo)}`,
      method: 'GET',
    },
    onResponseSuccess: responseUser => {
      setId(responseUser.userId);
      setNickName(responseUser.userNickName);
      setOriginNickName(responseUser.userNickName);
    },
    disableInitialRequest: false,
  });

  const [updateLoading, updateUser] = useAuthAxios<void>({
    requestOption: {
      url: `/users/${String(user?.userNo)}`,
      method: 'PUT',
    },
    onResponseSuccess: () => {
      publishUserUpdate();
      navigation.goBack();
    },
    disableInitialRequest: true,
  });

  const [withdrawLoading, withdraw] = useAuthAxios<void>({
    requestOption: {
      url: `/users/${String(user?.userNo)}`,
      method: 'DELETE',
    },
    onResponseSuccess: () => {
      logout();
      CustomAlert.simpleAlert('회원탈퇴가 완료되었습니다');
    },
    disableInitialRequest: true,
  });

  return (
    <LoadingContainer
      isLoading={queryLoading || updateLoading || withdrawLoading}>
      <ScreenContainer>
        <ScrollContainer extraHeight={0} keyboardShouldPersistTaps={'always'}>
          <ContentContainer gap="8px">
            {user?.userType === 'general' && (
              <BasicTextInput label="아이디" text={id} disabled={true} />
            )}
            <ValidatedTextInput
              label="닉네임"
              value={nickName}
              onChangeText={setNickName}
              placeholder=""
              validations={[
                {
                  condition: nickName => !!nickName,
                  errorText: '닉네임을 입력해주세요.',
                },
                {
                  condition: nickName => nickName.length <= 32,
                  errorText: '닉네임은 32자 미만으로 입력해주세요.',
                },
              ]}
            />
            <ContentContainer>
              <CtaButton
                text="저장"
                disabled={originNickName === nickName || nickNameError}
                onPress={() => {
                  updateUser({
                    data: {
                      nickName: nickName,
                    },
                  });
                }}
              />
              {user?.userType === 'general' && (
                <CtaButton
                  text="비밀번호 변경"
                  onPress={() => {
                    navigation.push('NoTab', {
                      screen: 'AccountSettingNavigator',
                      params: {
                        screen: 'AccountPasswordModification',
                      },
                    });
                  }}
                />
              )}
              <CtaButton
                text="로그아웃"
                onPress={() => {
                  logout();
                }}
                color="#FF5A5A"
                marginTop="16px"
              />
            </ContentContainer>
          </ContentContainer>
          <View
            style={{
              width: '100%',
              height: 40,
              justifyContent: 'center',
              marginTop: 32,
            }}>
            <Text
              style={{
                fontSize: 24,
              }}>
              Danger Zone
            </Text>
          </View>
          <CtaButton
            text="회원탈퇴"
            onPress={() => {
              CustomAlert.actionAlert(
                '회원탈퇴',
                '기록하셨던 주인공의 이야기를 포함하여 모든 데이터가 삭제됩니다. 탈퇴하시겠습니까?',
                () => {
                  withdraw({
                    data: {
                      socialToken: tokens.socialToken,
                    },
                  });
                },
              );
            }}
            marginTop="8px"
            color="red"
          />
        </ScrollContainer>
      </ScreenContainer>
    </LoadingContainer>
  );
};
export default AccountModificationPage;
