import React from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import {heroState} from '../../recoils/hero.recoil';
import {sharedImageDataState} from '../../recoils/share.recoil';
import {HeroType} from '../../types/hero.type';
import {SharePhoto} from '../../types/photo.type';
import BottomSheet from '../../components/styled/components/BottomSheet';
import {ShareAuthList} from '../../components/hero/ShareAuthList';
import {SharedBottomSheet} from './SharedBottomSheet';
import {MediaPickerBottomSheet} from './MediaPickerBottomSheet';

type Props = {
  // 공유 모달 관련
  openModal: boolean;
  onCloseModal: () => void;

  // 공유된 이미지 바텀시트 관련
  shareBottomSheetOpen: boolean;
  onCloseShareBottomSheet: () => void;

  // 미디어 피커 바텀시트 관련
  mediaPickerBottomSheetOpen: boolean;
  onCloseMediaPicker: () => void;

  // 기타
  isGalleryUploading: boolean;
  onSubmitGallery: () => void;
  onRefetch: () => void;
};

const BottomSheetSection = ({
  openModal,
  onCloseModal,
  shareBottomSheetOpen,
  onCloseShareBottomSheet,
  mediaPickerBottomSheetOpen,
  onCloseMediaPicker,
  isGalleryUploading,
  onSubmitGallery,
  onRefetch,
}: Props): JSX.Element => {
  // 글로벌 상태 관리 (Recoil)
  const hero = useRecoilValue<HeroType>(heroState);
  const [sharedImageData, setSharedImageData] =
    useRecoilState(sharedImageDataState);

  // Custom functions (핸들러, 로직 함수 등)
  const handleCloseShareBottomSheet = () => {
    onCloseShareBottomSheet();
    setSharedImageData({} as SharePhoto);
    onRefetch();
  };

  return (
    <>
      <BottomSheet opened={openModal} title={'공유하기'} onClose={onCloseModal}>
        <ShareAuthList />
      </BottomSheet>

      <SharedBottomSheet
        visible={shareBottomSheetOpen}
        sharedImageData={sharedImageData}
        onClose={handleCloseShareBottomSheet}
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
