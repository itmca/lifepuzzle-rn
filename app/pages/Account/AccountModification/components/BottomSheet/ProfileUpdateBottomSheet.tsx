import React, {useMemo, useState} from 'react';
import {ContentContainer} from '../../../../components/styled/container/ContentContainer.tsx';
import {AccountAvatar} from '../../../../components/avatar/AccountAvatar.tsx';
import BasicTextInput from '../../../../components/input/NewTextInput.tsx';
import {BasicButton} from '../../../../components/button/BasicButton.tsx';
import BottomSheet from '../../../../components/styled/components/BottomSheet.tsx';
import {useRecoilState, useRecoilValue} from 'recoil';
import {
  getCurrentUserPhotoUri,
  userState,
  writingUserState,
} from '../../../../recoils/user.recoil.ts';
import {useCommonActionSheet} from '../../../../components/styled/components/ActionSheet.tsx';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../../../navigation/types.tsx';
import {useUserProfileUpdate} from '../../../../service/hooks/user.update.hook.ts';
import {LoadingContainer} from '../../../../components/loadding/LoadingContainer.tsx';

type Props = {
  opened: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
};

export const ProfileUpdateBottomSheet = ({
  opened,
  onSuccess,
  onClose,
}: Props) => {
  const navigation = useNavigation<BasicNavigationProps>();
  const user = useRecoilValue(userState);
  const [writingUser, setWritingUser] = useRecoilState(writingUserState);
  const [newNicknameError, setNewNicknameError] = useState<boolean>(false);

  const currentUserPhotoUri = useRecoilValue(getCurrentUserPhotoUri);

  const openAlbum = () => {
    navigation.push('NoTab', {
      screen: 'AccountSettingNavigator',
      params: {
        screen: 'AccountSelectingPhoto',
      },
    });
  };

  const [updateProfile, isProfileUpdating] = useUserProfileUpdate({
    onSuccess: () => onSuccess && onSuccess(),
  });

  const {showActionSheet} = useCommonActionSheet({
    options: [
      {label: '앨범에서 선택', value: 'gallery', onSelect: () => openAlbum()},
      {
        label: '프로필 사진 삭제',
        value: 'delete',
        onSelect: () =>
          setWritingUser({
            ...writingUser,
            imageURL: undefined,
            modifiedImage: undefined,
            isProfileImageUpdate: true,
          }),
      },
    ],
  });

  return (
    <BottomSheet
      opened={opened}
      title={'프로필 수정'}
      snapPoints={useMemo(() => ['55%'], [])}
      onClose={() => {
        onClose && onClose();
        setWritingUser({...user, modifiedImage: undefined});
      }}>
      <ContentContainer alignCenter paddingVertical={16}>
        <AccountAvatar
          nickname={writingUser.userNickName}
          size={100}
          imageURL={currentUserPhotoUri}
          editable
          onEditPress={() => showActionSheet()}
        />
        <BasicTextInput
          label={'닉네임'}
          text={writingUser.userNickName}
          onChangeText={userNickName =>
            setWritingUser({...writingUser, userNickName})
          }
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
        <LoadingContainer isLoading={isProfileUpdating}>
          <BasicButton
            onPress={() => updateProfile()}
            disabled={
              (user.userNickName === writingUser.userNickName ||
                newNicknameError) &&
              !writingUser?.isProfileImageUpdate
            }
            text="저장하기"
          />
        </LoadingContainer>
      </ContentContainer>
    </BottomSheet>
  );
};
