import React, { useCallback } from 'react';

import { useShareStore } from '../../../../stores/share.store';
import { SharePhoto } from '../../../../types/core/media.type';
import BottomSheet from '../../../../components/ui/interaction/BottomSheet';
import { ShareAuthList } from '../../../../components/feature/hero/ShareAuthList';
import { SharedBottomSheet } from './SharedBottomSheet';
import { MediaPickerBottomSheet } from './MediaPickerBottomSheet';
import { HomeBottomSheetType } from '../../HomePage';

type Props = {
  activeBottomSheet: HomeBottomSheetType;
  onCloseBottomSheet: () => void;
  isGalleryUploading: boolean;
  onSubmitGallery: () => void;
  onRefetch: () => void;
};

const BottomSheetSection = ({
  activeBottomSheet,
  onCloseBottomSheet,
  isGalleryUploading,
  onSubmitGallery,
  onRefetch,
}: Props): React.ReactElement => {
  // 글로벌 상태 관리 (Zustand)
  const { sharedImageData, setSharedImageData } = useShareStore();

  // Custom functions (핸들러, 로직 함수 등)
  const handleCloseReceivedImageBottomSheet = useCallback(() => {
    onCloseBottomSheet();
    setSharedImageData({} as SharePhoto);
    onRefetch();
  }, [onCloseBottomSheet, setSharedImageData, onRefetch]);

  return (
    <>
      <BottomSheet
        opened={activeBottomSheet === 'hero-share'}
        title={'공유하기'}
        onClose={onCloseBottomSheet}
        paddingBottom={12}
      >
        <ShareAuthList />
      </BottomSheet>

      <SharedBottomSheet
        visible={activeBottomSheet === 'received-image'}
        sharedImageData={sharedImageData}
        onClose={handleCloseReceivedImageBottomSheet}
        isGalleryUploading={isGalleryUploading}
      />

      <MediaPickerBottomSheet
        visible={activeBottomSheet === 'media-picker'}
        onClose={onCloseBottomSheet}
        onSubmitGallery={onSubmitGallery}
        isGalleryUploading={isGalleryUploading}
      />
    </>
  );
};

export default BottomSheetSection;
