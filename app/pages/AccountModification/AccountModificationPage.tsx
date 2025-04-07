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
import {LegacyBasicTextInput} from '../../components/input/LegacyBasicTextInput.tsx';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer';
import {LegacyColor} from '../../constants/color.constant';
import {MediumText} from '../../components/styled/components/LegacyText.tsx';

import {Divider} from '../../components/styled/components/Divider';
import {XSmallTitle} from '../../components/styled/components/Title';
import {Pressable, TouchableOpacity} from 'react-native';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {UserType} from '../../types/user.type';
import {IMG_TYPE} from '../../constants/upload-file-type.constant';
import CtaButton from '../../components/button/CtaButton';
import {AccountAvatar} from '../../components/avatar/AccountAvatar.tsx';
import {useCommonActionSheet} from '../../components/styled/components/ActionSheet.tsx';

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
      url: `/v1/users/${String(user?.userNo)}`,
      method: 'GET',
    },
    onResponseSuccess: responseUser => {
      setModifyingUser({...responseUser, isProfileImageUpdate: false});
      setId(responseUser.userId);
      setNickName(responseUser.userNickName);
    },
    disableInitialRequest: false,
  });

  const [updateLoading, refetch] = useAuthAxios<void>({
    requestOption: {
      method: 'PUT',
      url: `/v1/users/${String(user?.userNo)}`,
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
      url: `/v1/users/${String(user?.userNo)}`,
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
    if (nicknameError && !nickName) {
      CustomAlert.simpleAlert('닉네임을 입력해 주세요.');
      return;
    }
    if (nicknameError && nickName.length > 8) {
      CustomAlert.simpleAlert('닉네임은 8자 이하로 입력해주세요.');
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
  const openAlbum = () => {
    navigation.push('NoTab', {
      screen: 'AccountSettingNavigator',
      params: {
        screen: 'AccountSelectingPhoto',
      },
    });
  };
  const {showActionSheet} = useCommonActionSheet({
    options: [
      {label: '앨범에서 선택', value: 'gallery', onSelect: () => openAlbum()},
      {
        label: '프로필 사진 삭제',
        value: 'delete',
        onSelect: () =>
          setModifyingUser({
            ...modifyingUser,
            imageURL: undefined,
            modifiedImage: undefined,
            isProfileImageUpdate: true,
          }),
      },
    ],
  });
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={onSubmit}>
          <MediumText color={LegacyColor.FONT_BLUE} fontWeight={600}>
            등록
          </MediumText>
        </Pressable>
      ),
    });
  }, [navigation, onSubmit]);

  return (
    <LoadingContainer
      isLoading={queryLoading || updateLoading || withdrawLoading}>
      <ScreenContainer>
        <ScrollContentContainer height={'100%'}>
          <ContentContainer gap={0}>
            <ContentContainer paddingVertical={32} alignCenter>
              <TouchableOpacity
                onPress={currentUserPhotoUri ? showActionSheet : openAlbum}>
                <AccountAvatar
                  nickName={nickName}
                  imageURL={currentUserPhotoUri}
                  size={120}
                />
              </TouchableOpacity>
            </ContentContainer>
            <ContentContainer gap={16} paddingHorizontal={20}>
              {user?.userType === 'general' && (
                <ContentContainer gap={6}>
                  <XSmallTitle
                    left={5}
                    fontWeight={600}
                    color={LegacyColor.LIGHT_BLACK}>
                    아이디
                  </XSmallTitle>
                  <LegacyBasicTextInput label="" text={id} disabled={true} />
                </ContentContainer>
              )}
              <ContentContainer gap={6}>
                <XSmallTitle
                  left={5}
                  fontWeight={600}
                  color={LegacyColor.LIGHT_BLACK}>
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
                    {
                      condition: nickName => nickName.length <= 8,
                      errorText: '8자 이하로 입력해주세요.',
                    },
                  ]}
                  onIsErrorChanged={setNickNameError}
                />
              </ContentContainer>
            </ContentContainer>
          </ContentContainer>
          <ContentContainer withScreenPadding>
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
            <ContentContainer paddingVertical={0}>
              <Divider />
            </ContentContainer>
            <ContentContainer>
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
          </ContentContainer>
        </ScrollContentContainer>
      </ScreenContainer>
    </LoadingContainer>
  );
};
export default AccountModificationPage;
