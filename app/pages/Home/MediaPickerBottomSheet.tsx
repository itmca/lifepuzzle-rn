import React, {useEffect, useRef} from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useRecoilValue, useResetRecoilState, useSetRecoilState} from 'recoil';
import BottomSheet from '../../components/styled/components/BottomSheet';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {IconName, SvgIcon} from '../../components/styled/components/SvgIcon';
import {
  BodyTextB,
  BodyTextM,
  Caption,
} from '../../components/styled/components/Text';
import {Color} from '../../constants/color.constant';
import {BasicNavigationProps} from '../../navigation/types';
import {SelectedStoryKeyState} from '../../recoils/story-view.recoil';
import {
  PostStoryKeyState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {Divider} from '../../components/styled/components/Divider.tsx';
import ImagePicker from 'react-native-image-crop-picker';
import {selectedGalleryItemsState} from '../../recoils/gallery-write.recoil';
import {toPhotoIdentifierFromImage} from '../../service/photo-identifier.service';
import {ensureCameraPermission} from '../../service/hooks/permission.hook';

interface MediaPickerBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmitGallery?: () => void;
  isGalleryUploading?: boolean;
}

interface MediaOptionProps {
  icon: IconName;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const MediaOption: React.FC<MediaOptionProps> = ({
  icon,
  title,
  subtitle,
  onPress,
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <ContentContainer
      useHorizontalLayout
      gap={16}
      paddingVertical={12}
      paddingHorizontal={12}>
      <ContentContainer width={32} height={32} alignCenter>
        <SvgIcon name={icon} size={32} />
      </ContentContainer>
      <ContentContainer flex={1} backgroundColor="transparent" gap={0}>
        <BodyTextB color={Color.BLACK}>{title}</BodyTextB>
        <BodyTextM color={Color.GREY_500}>{subtitle}</BodyTextM>
      </ContentContainer>
    </ContentContainer>
  </TouchableOpacity>
);

const isPickerCancelledError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const maybeError = error as {code?: string; message?: string};

  return (
    maybeError.code === 'E_PICKER_CANCELLED' ||
    maybeError.message === 'User cancelled image selection'
  );
};

export const MediaPickerBottomSheet: React.FC<MediaPickerBottomSheetProps> = ({
  visible,
  onClose,
  onSubmitGallery,
  isGalleryUploading = false,
}) => {
  const navigation = useNavigation<BasicNavigationProps>();
  const setSelectedStoryKey = useSetRecoilState(SelectedStoryKeyState);
  const resetWritingStory = useResetRecoilState(writingStoryState);
  const setPostStoryKey = useSetRecoilState(PostStoryKeyState);
  const setSelectedGalleryItems = useSetRecoilState(selectedGalleryItemsState);
  const selectedGalleryItems = useRecoilValue(selectedGalleryItemsState);
  const shouldSubmitAfterCameraCapture = useRef(false);

  // 카메라 촬영 후 상태가 업데이트되면 업로드 실행
  useEffect(() => {
    if (
      shouldSubmitAfterCameraCapture.current &&
      selectedGalleryItems.length > 0
    ) {
      shouldSubmitAfterCameraCapture.current = false;
      onSubmitGallery?.();
    }
  }, [selectedGalleryItems, onSubmitGallery]);

  const handleGalleryPress = () => {
    onClose();
    setSelectedStoryKey('');
    setPostStoryKey('');
    resetWritingStory();
    navigation.push('NoTab', {
      screen: 'StoryWritingNavigator',
      params: {
        screen: 'StoryGallerySelector',
      },
    });
  };

  const handleCameraPress = async () => {
    onClose();

    try {
      const hasPermission = await ensureCameraPermission();

      if (!hasPermission) {
        return;
      }

      const capturedImage = await ImagePicker.openCamera({
        mediaType: 'photo',
        includeExif: true,
        includeBase64: false,
        forceJpg: true,
        compressImageQuality: 0.8,
      });

      if (!capturedImage || !capturedImage.path) {
        Alert.alert('촬영된 이미지가 없습니다.');
        return;
      }

      const photoIdentifier = toPhotoIdentifierFromImage(capturedImage);

      setSelectedStoryKey('');
      setPostStoryKey('');
      resetWritingStory();

      // 카메라 촬영 플래그 설정 후 상태 업데이트
      shouldSubmitAfterCameraCapture.current = true;
      setSelectedGalleryItems([photoIdentifier]);
    } catch (error) {
      if (isPickerCancelledError(error)) {
        return;
      }

      console.error('Camera capture failed', error);
      Alert.alert('촬영에 실패했습니다.', '다시 시도해주세요.');
    }
  };

  const handleFacebookPress = () => {
    onClose();
    setSelectedStoryKey('');
    setPostStoryKey('');
    resetWritingStory();
    navigation.push('NoTab', {
      screen: 'StoryWritingNavigator',
      params: {
        screen: 'FacebookPhotoSelector',
      },
    });
  };

  return (
    <BottomSheet
      opened={visible}
      title="사진/동영상 추가하기"
      onClose={isGalleryUploading ? () => {} : onClose}>
      <ContentContainer gap={0} paddingBottom={32}>
        {isGalleryUploading ? (
          <ContentContainer paddingVertical={40} alignCenter>
            <BodyTextB color={Color.BLACK} marginBottom={8}>
              업로드 중...
            </BodyTextB>
            <BodyTextM color={Color.GREY_500}>잠시만 기다려주세요</BodyTextM>
          </ContentContainer>
        ) : (
          <>
            <ContentContainer gap={8}>
              <MediaOption
                icon="folder32"
                title="내 기기"
                subtitle="휴대폰 앨범에서 불러오기"
                onPress={handleGalleryPress}
              />

              <MediaOption
                icon="camera32"
                title="직접 촬영"
                subtitle="카메라로 촬영하기"
                onPress={handleCameraPress}
              />

              <MediaOption
                icon="facebookIcon"
                title="페이스북"
                subtitle="페이스북에서 한번에 가져오기"
                onPress={handleFacebookPress}
              />
            </ContentContainer>
            <Divider marginVertical={8} />
            <ContentContainer paddingHorizontal={12} paddingVertical={12}>
              <Caption color={Color.GREY_400}>
                * 외부 앱의 공유하기 기능으로도 추가할 수 있습니다
              </Caption>
            </ContentContainer>
          </>
        )}
      </ContentContainer>
    </BottomSheet>
  );
};
