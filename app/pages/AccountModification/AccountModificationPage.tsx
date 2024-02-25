import React, {useEffect, useState} from 'react';
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil';
import {
  getCurrentUserPhotoUri,
  userState,
  writingUserState,
} from '../../recoils/user.recoil';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {currentUserUpdate} from '../../recoils/update.recoil';
import {useUpdatePublisher} from '../../service/hooks/update.hooks';
import {useLogout} from '../../service/hooks/logout.hook';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {authState} from '../../recoils/auth.recoil';
import ValidatedTextInput from '../../components/input/ValidatedTextInput';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NoOutLineScreenContainer} from '../../components/styled/container/ScreenContainer';
import {ScrollContainer} from '../../components/styled/container/ScrollContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {MediumText} from '../../components/styled/components/Text';
import {Color} from '../../constants/color.constant';
import {Divider} from '../../components/styled/components/Divider';
import {XSmallTitle} from '../../components/styled/components/Title';
import Image from '../../components/styled/components/Image';
import {Pressable, TouchableOpacity} from 'react-native';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {UserType} from '../../types/user.type';
import {IMG_TYPE} from '../../constants/upload-file-type.constant';
import CtaButton from '../../components/button/CtaButton';

type AccountQueryResponse = {
  userNo: number;
  userId: string;
  userNickName: string;
  imageURL: string;
  recentHeroNo: number;
  userType: 'general' | 'kakao' | 'apple' | 'none';
};
const AccountModificationPage = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList>): JSX.Element => {
  const logout = useLogout();
  const user = useRecoilValue(userState);
  const tokens = useRecoilValue(authState);
  const currentUserPhotoUri = useRecoilValue(getCurrentUserPhotoUri);
  const [id, setId] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');
  const [modifyingUser, setModifyingUser] = useRecoilState(writingUserState);
  const [nicknameError, setNickNameError] = useState<boolean>(false);
  const resetWritingUser = useResetRecoilState(writingUserState);
  const publishUserUpdate = useUpdatePublisher(currentUserUpdate);

  const [queryLoading] = useAuthAxios<AccountQueryResponse>({
    requestOption: {
      url: `/users/${String(user?.userNo)}`,
      method: 'GET',
    },
    onResponseSuccess: responseUser => {
      setModifyingUser(responseUser);
      setId(responseUser.userId);
      setNickName(responseUser.userNickName);
    },
    disableInitialRequest: false,
  });

  const [updateLoading, refetch] = useAuthAxios<void>({
    requestOption: {
      method: 'PUT',
      url: `/users/${String(user?.userNo)}`,
      headers: {'Content-Type': 'multipart/form-data'},
    },
    onResponseSuccess: () => {
      CustomAlert.simpleAlert('회원 정보가 수정되었습니다.');
      publishUserUpdate();
      navigation.goBack();
    },
    onError: () => {
      CustomAlert.retryAlert(
        '회원 정보 수정이 실패했습니다.',
        onSubmit,
        goBack,
      );
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

  const addUserInFormData = (formData: FormData) => {
    const photo: PhotoIdentifier | undefined = modifyingUser?.modifiedImage;

    const currentTime = Date.now();
    const uri = photo?.node.image.uri;
    const fileParts = uri?.split('/');
    const imgName = fileParts ? fileParts[fileParts?.length - 1] : undefined;
    const imgPath = photo
      ? `${currentTime}_${String(imgName)}`
      : modifyingUser?.imageURL;

    const savedUser: UserType = {
      ...modifyingUser,
      userNo: user.userNo,
      userNickName: nickName,
      imageURL: imgPath,
    };

    formData.append('toUpdate', {
      string: JSON.stringify(savedUser),
      type: 'application/json',
    });
  };

  const addUserPhotoInFormData = (formData: FormData) => {
    const photo: PhotoIdentifier | undefined = modifyingUser?.modifiedImage;

    if (!photo) {
      return;
    }

    const uri = photo.node.image.uri;
    const fileParts = uri?.split('/');
    const fileName = fileParts ? fileParts[fileParts?.length - 1] : undefined;
    const type = IMG_TYPE;

    formData.append('photo', {
      uri: uri,
      type: type,
      name: fileName,
    });
  };

  const onSubmit = () => {
    if (nicknameError) {
      CustomAlert.simpleAlert('닉네임을 입력해 주세요.');
      return;
    }

    const formData = new FormData();

    addUserInFormData(formData);
    addUserPhotoInFormData(formData);

    refetch({data: formData});
  };

  const goBack = () => {
    resetWritingUser();
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={onSubmit}>
          <MediumText color={Color.FONT_BLUE} fontWeight={600}>
            등록
          </MediumText>
        </Pressable>
      ),
    });
  }, [navigation, onSubmit]);

  return (
    <LoadingContainer
      isLoading={queryLoading || updateLoading || withdrawLoading}>
      <NoOutLineScreenContainer>
        <ScrollContainer extraHeight={0} keyboardShouldPersistTaps={'always'}>
          <ContentContainer
            marginTop="40px"
            marginBottom="20px"
            justifyContent="center"
            alignItems="center">
            <TouchableOpacity
              onPress={() => {
                navigation.push('NoTab', {
                  screen: 'AccountSettingNavigator',
                  params: {
                    screen: 'AccountSelectingPhoto',
                  },
                });
              }}>
              <Image
                style={{borderRadius: 50}}
                width={90}
                height={90}
                source={
                  currentUserPhotoUri
                    ? {uri: currentUserPhotoUri}
                    : require('../../assets/images/profile_icon.png')
                }
              />
            </TouchableOpacity>
          </ContentContainer>
          <ContentContainer gap="16px" padding={16}>
            {user?.userType === 'general' && (
              <ContentContainer gap="6px">
                <XSmallTitle
                  left={5}
                  fontWeight={600}
                  color={Color.LIGHT_BLACK}>
                  아이디
                </XSmallTitle>
                <BasicTextInput label="" text={id} disabled={true} />
              </ContentContainer>
            )}
            <ContentContainer gap="6px">
              <XSmallTitle left={5} fontWeight={600} color={Color.LIGHT_BLACK}>
                닉네임
              </XSmallTitle>
              <ValidatedTextInput
                label=""
                value={nickName}
                onChangeText={setNickName}
                placeholder=""
                validations={[
                  {
                    condition: nickName => !!nickName,
                    errorText: '닉네임을 입력해주세요.',
                  },
                ]}
                onIsErrorChanged={setNickNameError}
              />
            </ContentContainer>
          </ContentContainer>
          <Divider />
          <ContentContainer padding={16}>
            <ContentContainer>
              {user?.userType === 'general' && (
                <CtaButton
                  outlined
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
                filled
                text="로그아웃"
                onPress={() => {
                  logout();
                }}
              />
            </ContentContainer>
          </ContentContainer>
          <Divider />
          <ContentContainer padding={16}>
            <CtaButton
              outlined
              text="회원탈퇴"
              onPress={() => {
                CustomAlert.actionAlert({
                  title: '회원탈퇴',
                  desc: '기록하셨던 주인공의 이야기를 포함하여 모든 데이터가 삭제됩니다. 탈퇴하시겠습니까?',
                  actionBtnText: '탈퇴',
                  action: () => {
                    withdraw({
                      data: {
                        socialToken: tokens.socialToken,
                      },
                    });
                  },
                });
              }}
            />
          </ContentContainer>
        </ScrollContainer>
      </NoOutLineScreenContainer>
    </LoadingContainer>
  );
};
export default AccountModificationPage;
