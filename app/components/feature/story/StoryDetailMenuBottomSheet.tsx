import {Alert, TouchableOpacity} from 'react-native';
import {Color} from '../../../constants/color.constant.ts';

import {useNavigation} from '@react-navigation/native';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {BasicNavigationProps} from '../../../navigation/types.tsx';
import {writingStoryState} from '../../../recoils/content/story-write.recoil.ts';
import {
  useDeleteGallery,
  useDeleteStory,
} from '../../../service/hooks/story.delete.hook.ts';
import {ContentContainer} from '../../ui/layout/ContentContainer';
import {GalleryType} from '../../../types/photo.type.ts';
import {
  OpenDetailBottomSheet,
  SelectedStoryKeyState,
} from '../../../recoils/content/story-view.recoil.ts';
import {SvgIcon} from '../../ui/display/SvgIcon.tsx';
import {Title} from '../../ui/base/TextBase';
import {Divider} from '../../ui/base/Divider.tsx';
import BottomSheet from '../../ui/interaction/BottomSheet.tsx';
import {showToast} from '../../ui/feedback/Toast.tsx';
import RNFetchBlob from 'rn-fetch-blob';
import {getFormattedDateTime} from '../../../service/date-time-display.service.ts';
import Share from 'react-native-share';

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
    const {config, fs} = RNFetchBlob;
    let picturePath = `${fs.dirs.CacheDir}/lp_${getFormattedDateTime()}.jpg`;
    await config({
      fileCache: true,
      appendExt: 'jpg',
      path: picturePath,
    }).fetch('GET', gallery.url);

    const shareOptions = {
      title: gallery.story?.title ?? '',
      message: gallery.story?.content ?? '',
      url: 'file://' + picturePath,
      type: `image/jpg`,
      subject: gallery.story?.title ?? '',
    };

    Share.open(shareOptions)
      .then(res => {
        showToast('공유가 완료되었습니다.');
        setOpenModal(false);
      })
      .catch(err => {
        console.log(err);
      });
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
