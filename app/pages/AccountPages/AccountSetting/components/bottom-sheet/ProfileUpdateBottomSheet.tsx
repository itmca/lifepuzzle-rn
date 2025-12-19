import React, { useCallback, useMemo, useState } from 'react';
import { ContentContainer } from '../../../../../components/ui/layout/ContentContainer.tsx';
import { AccountAvatar } from '../../../../../components/ui/display/Avatar';
import { BasicTextInput } from '../../../../../components/ui/form/TextInput.tsx';
import { BasicButton } from '../../../../../components/ui/form/Button';
import { BottomSheet } from '../../../../../components/ui/interaction/BottomSheet.tsx';
import { useUserStore } from '../../../../../stores/user.store';
import { useCommonActionSheet } from '../../../../../components/ui/interaction/ActionSheet.tsx';
import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../../../../navigation/types.tsx';
import { useUpdateUserProfile } from '../../../../../services/user/user.mutation';
import { LoadingContainer } from '../../../../../components/ui/feedback/LoadingContainer';

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
  const { user, writingUser, setWritingUser, getCurrentUserPhotoUri } =
    useUserStore();
  const [newNicknameError, setNewNicknameError] = useState<boolean>(false);

  const currentUserPhotoUri = getCurrentUserPhotoUri();

  const openAlbum = useCallback(() => {
    navigation.navigate('App', {
      screen: 'AccountSettingNavigator',
      params: {
        screen: 'AccountProfileSelector',
      },
    });
  }, [navigation]);

  const { updateUserProfile: updateProfile, isPending: isProfileUpdating } =
    useUpdateUserProfile({
      onSuccess: () => onSuccess && onSuccess(),
    });

  const handleRemoveProfilePhoto = useCallback(() => {
    setWritingUser({
      ...writingUser,
      imageUrl: undefined,
      modifiedImage: undefined,
      profileImageUpdate: true,
    });
  }, [setWritingUser, writingUser]);

  const actionSheetOptions = useMemo(() => {
    const options = [
      { label: '앨범에서 선택', value: 'gallery', onSelect: openAlbum },
    ];

    if (currentUserPhotoUri) {
      options.push({
        label: '프로필 사진 삭제',
        value: 'delete',
        onSelect: handleRemoveProfilePhoto,
      });
    }

    return options;
  }, [currentUserPhotoUri, handleRemoveProfilePhoto, openAlbum]);

  const { showActionSheet } = useCommonActionSheet({
    options: actionSheetOptions,
  });

  const snapPoints = useMemo(() => ['55%'], []);

  return (
    <BottomSheet
      opened={opened}
      title={'프로필 수정'}
      snapPoints={snapPoints}
      onClose={() => {
        onClose && onClose();
        user && setWritingUser({ ...user, modifiedImage: undefined });
      }}
    >
      <ContentContainer alignCenter paddingVertical={16}>
        <AccountAvatar
          size={100}
          imageUrl={currentUserPhotoUri}
          editable
          onEditPress={() => showActionSheet()}
        />
        <BasicTextInput
          label={'닉네임'}
          text={writingUser.nickName}
          onChangeText={nickName =>
            setWritingUser({ ...writingUser, nickName })
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
          useInBottomSheet={true}
        />
        <LoadingContainer isLoading={isProfileUpdating}>
          <BasicButton
            onPress={() => updateProfile()}
            disabled={
              (user?.nickName === writingUser.nickName || newNicknameError) &&
              !writingUser?.profileImageUpdate
            }
            text="저장하기"
          />
        </LoadingContainer>
      </ContentContainer>
    </BottomSheet>
  );
};
