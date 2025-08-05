import {Alert, Share, TouchableOpacity} from 'react-native';
import {Color} from '../../constants/color.constant.ts';

import {useNavigation} from '@react-navigation/native';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {writingStoryState} from '../../recoils/story-write.recoil.ts';
import {
  useDeleteGallery,
  useDeleteStory,
} from '../../service/hooks/story.delete.hook.ts';
import {ContentContainer} from '../styled/container/ContentContainer.tsx';
import {GalleryType} from '../../types/photo.type.ts';
import {
  OpenDetailBottomSheet,
  SelectedStoryKeyState,
} from '../../recoils/story-view.recoil.ts';
import {SvgIcon} from '../styled/components/SvgIcon.tsx';
import {Title} from '../styled/components/Text.tsx';
import {Divider} from '../styled/components/Divider.tsx';
import BottomSheet from '../styled/components/BottomSheet.tsx';
import {showToast} from '../styled/components/Toast.tsx';

type Props = {
  type: 'story' | 'photo';
  gallery: GalleryType;
};

export const StoryDetailMenuBottomSheet = ({
  type = 'story',
  gallery,
}: Props): JSX.Element => {
  const [openModal, setOpenModal] = useRecoilState(OpenDetailBottomSheet);
  const setWritingStory = useSetRecoilState(writingStoryState);
  const setEditStoryKey = useSetRecoilState(SelectedStoryKeyState);

  const navigation = useNavigation<BasicNavigationProps>();
  const isStory = type === 'story';
  const [deleteStory] = useDeleteStory({
    storyKey: gallery.story ? gallery.story.id : '',
  });
  const [deleteGallery] = useDeleteGallery({galleryId: gallery.id});

  const onEditStory = () => {
    setWritingStory({
      title: gallery.story?.title ?? '',
      content: gallery.story?.content ?? '',
      date: gallery.story?.date ? new Date(gallery.story?.date) : new Date(),
      gallery: [{id: gallery.id, uri: gallery.url, tagKey: gallery.tag.key}],
      voice:
        gallery.story?.audios && gallery.story?.audios.length > 0
          ? gallery.story?.audios[0]
          : '',
    });

    setEditStoryKey(gallery.story?.id ?? '');
    setOpenModal(false);
    navigation.push('NoTab', {
      screen: 'StoryWritingNavigator',
      params: {
        screen: 'StoryWritingMain',
      },
    });
  };
  const onDeleteStory = () => {
    //TODO 이야기 삭제 확인
    Alert.alert('', '사진에 연결된 이야기를 삭제하시겠습니까?', [
      {
        text: '삭제',
        onPress: () => {
          deleteStory();
        },
      },
      {
        text: '취소',
        onPress: () => {},
      },
    ]);
  };
  const onDeleteGallery = () => {
    //TODO 사진 삭제 확인
    let msg = isStory
      ? '연결된 이야기도 함께 삭제가 됩니다. 사진을 삭제하시겠습니까?'
      : '사진을 삭제하시겠습니까?';
    Alert.alert('', msg, [
      {
        text: '삭제',
        onPress: () => {
          deleteGallery();
        },
      },
      {
        text: '취소',
        onPress: () => {},
      },
    ]);
  };
  const onShareGallery = async () => {
    try {
      const result = await Share.share({
        title: gallery.story?.title ?? '',
        message: gallery.story?.content ?? '',
        url: gallery.url,
      });
      if (result.action === Share.sharedAction) {
        showToast('공유가 완료되었습니다.');
        setOpenModal(false);
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };
  return (
    <BottomSheet
      opened={openModal}
      onClose={() => {
        setOpenModal(false);
      }}>
      <ContentContainer gap={0}>
        {isStory && (
          <>
            <TouchableOpacity onPress={onEditStory}>
              <ContentContainer
                gap={6}
                height={'48px'}
                useHorizontalLayout
                justifyContent="flex-start">
                <SvgIcon name={'pencil'} />
                <Title color={Color.GREY_800}>이야기 수정하기</Title>
              </ContentContainer>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDeleteStory}>
              <ContentContainer
                gap={6}
                height={'48px'}
                useHorizontalLayout
                justifyContent="flex-start">
                <SvgIcon name={'trash'} />
                <Title color={Color.GREY_800}>이야기 삭제하기</Title>
              </ContentContainer>
            </TouchableOpacity>
            <ContentContainer height={'20px'} alignCenter>
              <Divider />
            </ContentContainer>
          </>
        )}
        <TouchableOpacity onPress={onDeleteGallery}>
          <ContentContainer
            gap={6}
            height={'48px'}
            useHorizontalLayout
            justifyContent="flex-start">
            <SvgIcon name={'trash'} />
            <Title color={Color.GREY_800}>사진 삭제하기</Title>
          </ContentContainer>
        </TouchableOpacity>
        <TouchableOpacity onPress={onShareGallery}>
          <ContentContainer
            gap={2}
            height={'48px'}
            useHorizontalLayout
            justifyContent="flex-start">
            <SvgIcon name={'link'} size={28} />
            <Title color={Color.GREY_800}>사진 공유하기</Title>
          </ContentContainer>
        </TouchableOpacity>
      </ContentContainer>
    </BottomSheet>
  );
};
