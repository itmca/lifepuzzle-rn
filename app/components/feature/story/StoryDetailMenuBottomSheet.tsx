import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Color } from '../../../constants/color.constant.ts';
import { logger } from '../../../utils/logger.util';
import { useDeleteGallery } from '../../../services/story/story.mutation';
import { ContentContainer } from '../../ui/layout/ContentContainer';
import { GalleryType } from '../../../types/core/media.type';
import { useUIStore } from '../../../stores/ui.store';
import { SvgIcon } from '../../ui/display/SvgIcon.tsx';
import { Title } from '../../ui/base/TextBase';
import { BottomSheet } from '../../ui/interaction/BottomSheet.tsx';
import { showToast } from '../../ui/feedback/Toast.tsx';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { getFormattedDateTime } from '../../../utils/date-formatter.util.ts';
import Share from 'react-native-share';

type Props = {
  gallery: GalleryType;
};

export const StoryDetailMenuBottomSheet = ({
  gallery,
}: Props): React.ReactElement => {
  const openModal = useUIStore(state => state.openDetailBottomSheet);
  const setOpenModal = useUIStore(state => state.setOpenDetailBottomSheet);

  const { deleteGallery } = useDeleteGallery({ galleryId: gallery.id });

  const onDeleteGallery = () => {
    Alert.alert('', '사진을 삭제하시겠습니까?', [
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
    const { config, fs } = ReactNativeBlobUtil;
    let picturePath = `${fs.dirs.CacheDir}/lp_${getFormattedDateTime()}.jpg`;
    await config({
      fileCache: true,
      appendExt: 'jpg',
      path: picturePath,
    }).fetch('GET', gallery.url);

    const shareOptions = {
      url: 'file://' + picturePath,
      type: 'image/jpg',
    };

    Share.open(shareOptions)
      .then(() => {
        showToast('공유가 완료되었습니다.');
        setOpenModal(false);
      })
      .catch(err => {
        logger.debug('Share error:', err);
      });
  };
  return (
    <BottomSheet
      headerPaddingBottom={4}
      opened={openModal}
      onClose={() => {
        setOpenModal(false);
      }}
    >
      <ContentContainer gap={0} paddingBottom={16}>
        <ContentContainer gap={8}>
          <Title>사진</Title>
          <ContentContainer gap={0}>
            <TouchableOpacity onPress={onShareGallery}>
              <ContentContainer
                gap={2}
                height={48}
                useHorizontalLayout
                justifyContent="flex-start"
              >
                <SvgIcon name={'link'} size={28} />
                <Title color={Color.GREY_800}>사진 공유하기</Title>
              </ContentContainer>
            </TouchableOpacity>

            <TouchableOpacity onPress={onDeleteGallery}>
              <ContentContainer
                gap={6}
                height={48}
                useHorizontalLayout
                justifyContent="flex-start"
              >
                <SvgIcon name={'trash'} />
                <Title color={Color.GREY_800}>사진 삭제하기</Title>
              </ContentContainer>
            </TouchableOpacity>
          </ContentContainer>
        </ContentContainer>
      </ContentContainer>
    </BottomSheet>
  );
};
