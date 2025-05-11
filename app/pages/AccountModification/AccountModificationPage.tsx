import React, {useEffect, useMemo, useState} from 'react';
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
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {Color, LegacyColor} from '../../constants/color.constant';
import {MediumText} from '../../components/styled/components/LegacyText.tsx';
import {Pressable, TouchableOpacity} from 'react-native';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {UserType} from '../../types/user.type';
import {IMG_TYPE} from '../../constants/upload-file-type.constant';
import {AccountAvatar} from '../../components/avatar/AccountAvatar.tsx';
import {useCommonActionSheet} from '../../components/styled/components/ActionSheet.tsx';
import {
  BodyTextM,
  Head,
  Title,
} from '../../components/styled/components/Text.tsx';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer.tsx';
import {BasicButton} from '../../components/button/BasicButton.tsx';
import {ShareAuthList} from '../../components/hero/ShareAuthList.tsx';
import BottomSheet from '../../components/styled/components/BottomSheet.tsx';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {HeroAvatar} from '../../components/avatar/HeroAvatar.tsx';
import {IconButton} from 'react-native-paper';
import {SvgIcon} from '../../components/styled/components/SvgIcon.tsx';
import BasicTextInput from '../../components/input/NewTextInput.tsx';
import {showToast} from '../../components/styled/components/Toast.tsx';

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

  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [newNickname, setNewNickname] = useState<string>('');
  const [modifyingUser, setModifyingUser] = useRecoilState(writingUserState);
  const [newNicknameError, setNewNicknameError] = useState<boolean>(false);
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
      setNickname(responseUser.userNickName);
      setNewNickname(responseUser.userNickName);
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
      showToast('성공적으로 저장되었습니다.');
      publishUserUpdate();
      setProfileModalOpen(false);
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
      userNickName: newNickname,
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
    if (newNicknameError && !nickname) {
      CustomAlert.simpleAlert('닉네임을 입력해 주세요.');
      return;
    }
    if (newNicknameError && nickname.length > 8) {
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
        <ContentContainer gap={8} alignCenter expandToEnd>
          <AccountAvatar
            nickname={nickname}
            imageURL={user.imageURL}
            size={100}
          />
          <ContentContainer gap={0} alignCenter>
            <Head>{nickname}</Head>
            {user?.userType === 'general' && (
              <Title color={Color.GREY_500}>{id}</Title>
            )}
          </ContentContainer>
        </ContentContainer>
        <ContentContainer withScreenPadding paddingBottom={65}>
          <BasicButton
            text={'프로필 수정'}
            onPress={() => setProfileModalOpen(true)}
          />
          <ContentContainer>
            {user?.userType === 'general' && (
              <BasicButton
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
            <ContentContainer alignCenter>
              <TouchableOpacity
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
                }}>
                <BodyTextM color={Color.GREY_800} underline>
                  회원 탈퇴
                </BodyTextM>
              </TouchableOpacity>
            </ContentContainer>
          </ContentContainer>
        </ContentContainer>
        <BottomSheetModalProvider>
          <BottomSheet
            opened={profileModalOpen}
            title={'프로필 수정'}
            snapPoints={useMemo(() => ['55%'], [])}
            onClose={() => {
              setProfileModalOpen(false);
              setNewNickname(nickname);
              setModifyingUser({...modifyingUser, modifiedImage: undefined});
            }}>
            <TouchableOpacity onPress={() => showActionSheet()}>
              <ContentContainer alignCenter paddingVertical={16}>
                <AccountAvatar
                  nickname={nickname}
                  size={100}
                  imageURL={currentUserPhotoUri}
                  editable
                />
                <BasicTextInput
                  label={'닉네임'}
                  text={newNickname}
                  onChangeText={setNewNickname}
                  placeholder="변경하실 닉네임을 입력해 주세요"
                  validations={[
                    {
                      condition: text => text.length > 0,
                      errorText: '아이디를 입력해주세요.',
                    },
                    {
                      condition: text => !text || text.length <= 8,
                      errorText: '닉네임은 8자 이하로 입력해주세요.',
                    },
                  ]}
                  onIsErrorChanged={setNewNicknameError}
                />
                <BasicButton
                  onPress={onSubmit}
                  disabled={
                    (nickname === newNickname || newNicknameError) &&
                    !modifyingUser?.isProfileImageUpdate
                  }
                  text="저장하기"
                />
              </ContentContainer>
            </TouchableOpacity>
          </BottomSheet>
        </BottomSheetModalProvider>
      </ScreenContainer>
    </LoadingContainer>
  );
};
export default AccountModificationPage;
