import React, {useEffect, useState} from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import BottomSheet from '../../../../components/ui/interaction/BottomSheet';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../../components/ui/layout/ContentContainer.tsx';
import {BodyTextB} from '../../../../components/ui/base/TextBase';
import {Color} from '../../../../constants/color.constant.ts';
import {toPhotoIdentifier} from '../../../../service/photo-identifier.service.ts';
import {SharedData} from '../../../../../src/NativeLPShareModule.ts';
import {
  UploadRequest,
  useUploadGalleryV2,
} from '../../../../service/hooks/gallery.upload.hook.ts';
import {heroState} from '../../../../recoils/content/hero.recoil.ts';
import {TagType} from '../../../../types/photo.type.ts';
import {
  selectedTagState,
  tagState,
} from '../../../../recoils/content/media.recoil.ts';
import {BasicButton} from '../../../../components/ui/form/Button';
import GallerySelect from '../Gallery/GallerySelect.tsx';
import {useUploadHeroes} from '../../../../service/hooks/hero.query.hook.ts';
import {HeroSelect} from './HeroSelect';
import {toInternationalAge} from '../../../../service/date-time-display.service.ts';
import {CustomAlert} from '../../../../components/ui/feedback/CustomAlert';

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
  const hero = useRecoilValue(heroState);
  const selectedTag = useRecoilValue<TagType>(selectedTagState);
  const [heroAge, setHeroAge] = useState<number>(
    hero ? toInternationalAge(hero.birthday) : 0,
  );
  const [tags] = useRecoilState<TagType[]>(tagState);
  const [uploadRequest, setUploadRequest] = useState<UploadRequest>({
    heroNo: hero?.heroNo || 0,
    selectedTag: selectedTag,
    selectedGalleryItems: [],
  });
  const [submitGallery] = useUploadGalleryV2({
    request: uploadRequest,
    onClose: onClose,
  });
  const {
    res: {heroes, loading},
    fetchHeroes: fetchUploadHeroes,
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
        heroNo: hero?.heroNo || 0,
        selectedTag: selectedTag,
        selectedGalleryItems: validImages.map(item =>
          toPhotoIdentifier(item ?? ''),
        ),
      });
    }
  }, [sharedImageData, hero?.heroNo, selectedTag, onClose]);
  return (
    <BottomSheet
      opened={visible}
      title={'공유된 이미지 업로드'}
      onClose={isGalleryUploading ? () => {} : onClose}>
      <ContentContainer gap={24}>
        <ScrollContentContainer useHorizontalLayout gap={6}>
          {heroes &&
            heroes.map((item, index) => {
              return (
                <ContentContainer
                  key={index}
                  width={54.5}
                  height={100}
                  gap={12}>
                  <HeroSelect
                    item={item}
                    selected={uploadRequest?.heroNo === item.heroNo}
                    onSelect={() => {
                      setUploadRequest({
                        ...uploadRequest,
                        heroNo: item.heroNo,
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
      <ContentContainer paddingTop={28}>
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
