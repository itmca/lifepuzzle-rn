import React, { useEffect, useState } from 'react';

import BottomSheet from '../../../../components/ui/interaction/BottomSheet';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../../components/ui/layout/ContentContainer.tsx';
import { BodyTextB } from '../../../../components/ui/base/TextBase';
import { Color } from '../../../../constants/color.constant.ts';
import { toPhotoIdentifier } from '../../../../service/utils/photo-identifier.service.ts';
import { SharedData } from '../../../../../src/NativeLPShareModule.ts';
import {
  UploadRequest,
  useUploadGalleryV2,
} from '../../../../service/gallery/gallery.upload.hook.ts';
import { useHeroStore } from '../../../../stores/hero.store';
import { TagType } from '../../../../types/core/media.type';
import { useMediaStore } from '../../../../stores/media.store';
import { useSelectionStore } from '../../../../stores/selection.store';
import { BasicButton } from '../../../../components/ui/form/Button';
import GallerySelect from '../gallery/GallerySelect.tsx';
import { useUploadHeroes } from '../../../../service/hero/hero.query.hook.ts';
import { HeroSelect } from './HeroSelect';
import { toInternationalAge } from '../../../../service/utils/date-time.service.ts';
import { CustomAlert } from '../../../../components/ui/feedback/CustomAlert';

interface SharedBottomSheetProps {
  visible: boolean;
  sharedImageData: SharedData;
  onClose: () => void;
  isGalleryUploading?: boolean;
}

export const SharedBottomSheet: React.FC<SharedBottomSheetProps> = ({
  visible,
  sharedImageData,
  onClose,
  isGalleryUploading = false,
}) => {
  const hero = useHeroStore(state => state.currentHero);
  const selectedTag = useSelectionStore(state => state.selectedTag);
  const [heroAge, setHeroAge] = useState<number>(
    hero ? toInternationalAge(hero.birthday) : 0,
  );
  const tags = useMediaStore(state => state.tags);
  const [uploadRequest, setUploadRequest] = useState<UploadRequest>({
    heroNo: hero?.id || 0,
    selectedTag: selectedTag || undefined,
    selectedGalleryItems: [],
  });
  const [submitGallery] = useUploadGalleryV2({
    request: uploadRequest,
    onClose: () => {
      onClose();
    },
  });
  const {
    res: { heroes },
  } = useUploadHeroes();
  // 카메라 촬영 후 상태가 업데이트되면 업로드 실행
  useEffect(() => {
    if (sharedImageData && sharedImageData.type) {
      const uploadSharedImages =
        sharedImageData.type === 'single'
          ? [sharedImageData.uri]
          : sharedImageData.uriList;
      const validImages = (uploadSharedImages ?? []).filter(Boolean);
      if (validImages.length === 0) {
        onClose();
        return;
      }
      setUploadRequest({
        heroNo: hero?.id || 0,
        selectedTag: selectedTag || undefined,
        selectedGalleryItems: validImages.map(item =>
          toPhotoIdentifier(item ?? ''),
        ),
      });
    }
  }, [sharedImageData, hero?.id, selectedTag, onClose]);
  return (
    <BottomSheet
      opened={visible}
      title={'공유된 이미지 업로드'}
      onClose={isGalleryUploading ? undefined : onClose}
      paddingBottom={12}
    >
      <ContentContainer gap={24}>
        <ScrollContentContainer useHorizontalLayout gap={6}>
          {heroes &&
            heroes.map((item, index) => {
              return (
                <ContentContainer
                  key={index}
                  width={54.5}
                  height={100}
                  gap={12}
                >
                  <HeroSelect
                    item={item}
                    selected={uploadRequest?.heroNo === item.id}
                    onSelect={() => {
                      setUploadRequest({
                        ...uploadRequest,
                        heroNo: item.id,
                        selectedTag: undefined,
                      });
                      setHeroAge(toInternationalAge(item.birthday));
                    }}
                  />
                </ContentContainer>
              );
            })}
        </ScrollContentContainer>
        <ContentContainer gap={8}>
          <BodyTextB color={Color.MAIN_DARK}>앨범 선택</BodyTextB>
          <ScrollContentContainer useHorizontalLayout gap={6}>
            {tags
              ?.filter(tag => tag.key !== 'AI_PHOTO')
              .filter((_, index) => index <= heroAge / 10)
              .map((item: TagType, index) => {
                return (
                  <GallerySelect
                    key={item.key || index}
                    item={item}
                    index={index}
                    selected={uploadRequest?.selectedTag?.key === item.key}
                    onSelect={item =>
                      setUploadRequest({
                        ...uploadRequest,
                        selectedTag: item,
                      })
                    }
                  />
                );
              })}
          </ScrollContentContainer>
        </ContentContainer>
      </ContentContainer>
      <ContentContainer paddingTop={16}>
        <BasicButton
          onPress={() => {
            if (!uploadRequest.heroNo) {
              CustomAlert.simpleAlert('주인공을 선택해주세요.');
              return;
            }
            if (!uploadRequest.selectedTag) {
              CustomAlert.simpleAlert('앨범을 선택해주세요.');
              return;
            }
            submitGallery();
          }}
          text="추가하기"
        />
      </ContentContainer>
    </BottomSheet>
  );
};
