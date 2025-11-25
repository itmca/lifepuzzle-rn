import React, { useCallback } from 'react';

import { useShareStore } from '../../../../stores/share.store';
import { SharePhoto } from '../../../../types/core/media.type';
import BottomSheet from '../../../../components/ui/interaction/BottomSheet';
import { ShareAuthList } from '../../../../components/feature/hero/ShareAuthList';
import { SharedBottomSheet } from './SharedBottomSheet';
import { MediaPickerBottomSheet } from './MediaPickerBottomSheet';

type Props = {
  // 주인공 공유 모달 관련
  heroShareModalOpen: boolean;
  onCloseHeroShareModal: () => void;

  // 외부 공유받은 이미지 바텀시트 관련
  receivedImageBottomSheetOpen: boolean;
  onCloseReceivedImageBottomSheet: () => void;

  // 미디어 피커 바텀시트 관련
  mediaPickerBottomSheetOpen: boolean;
  onCloseMediaPicker: () => void;

  // 기타
  isGalleryUploading: boolean;
  onSubmitGallery: () => void;
  onRefetch: () => void;
};

const BottomSheetSection = ({
  heroShareModalOpen,
  onCloseHeroShareModal,
  receivedImageBottomSheetOpen,
  onCloseReceivedImageBottomSheet,
  mediaPickerBottomSheetOpen,
  onCloseMediaPicker,
  isGalleryUploading,
  onSubmitGallery,
  onRefetch,
}: Props): React.ReactElement => {
  // 글로벌 상태 관리 (Zustand)
  const { sharedImageData, setSharedImageData } = useShareStore();

  // Custom functions (핸들러, 로직 함수 등)
  const handleCloseReceivedImageBottomSheet = useCallback(() => {
    onCloseReceivedImageBottomSheet();
    setSharedImageData({} as SharePhoto);
    onRefetch();
  }, [onCloseReceivedImageBottomSheet, setSharedImageData, onRefetch]);

  return (
    <>
      <BottomSheet
        opened={heroShareModalOpen}
        title={'공유하기'}
        onClose={onCloseHeroShareModal}
      >
        <ShareAuthList />
      </BottomSheet>

      <SharedBottomSheet
        visible={receivedImageBottomSheetOpen}
        sharedImageData={sharedImageData}
        onClose={handleCloseReceivedImageBottomSheet}
        isGalleryUploading={isGalleryUploading}
      />

      <MediaPickerBottomSheet
        visible={mediaPickerBottomSheetOpen}
        onClose={onCloseMediaPicker}
        onSubmitGallery={onSubmitGallery}
        isGalleryUploading={isGalleryUploading}
      />
    </>
  );
};

export default BottomSheetSection;
