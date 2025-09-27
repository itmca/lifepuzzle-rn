import React from 'react';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useResetRecoilState, useSetRecoilState} from 'recoil';
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

interface MediaPickerBottomSheetProps {
  visible: boolean;
  onClose: () => void;
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

export const MediaPickerBottomSheet: React.FC<MediaPickerBottomSheetProps> = ({
  visible,
  onClose,
}) => {
  const navigation = useNavigation<BasicNavigationProps>();
  const setSelectedStoryKey = useSetRecoilState(SelectedStoryKeyState);
  const resetWritingStory = useResetRecoilState(writingStoryState);
  const setPostStoryKey = useSetRecoilState(PostStoryKeyState);

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

  const handleCameraPress = () => {
    onClose();
    // TODO: 카메라 촬영 기능 구현
    console.log('Camera press - 구현 필요');
  };

  const handleFacebookPress = () => {
    onClose();
    // TODO: 페이스북 연동 기능 구현
    console.log('Facebook press - 구현 필요');
  };

  return (
    <BottomSheet
      opened={visible}
      title="사진/동영상 추가하기"
      onClose={onClose}>
      <ContentContainer gap={0} paddingBottom={32}>
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
      </ContentContainer>
    </BottomSheet>
  );
};
