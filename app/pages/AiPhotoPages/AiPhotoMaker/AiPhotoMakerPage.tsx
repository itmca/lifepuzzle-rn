import React, { useRef, useState } from 'react';
import { ScrollView } from 'react-native';

import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer';
import { ScreenContainer } from '../../../components/ui/layout/ScreenContainer';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../components/ui/layout/ContentContainer.tsx';
import { Title } from '../../../components/ui/base/TextBase';
import { Photo } from '../../../components/ui/base/ImageBase';
import { AiPhotoMakerButton } from '../components/AiPhotoMakerButton';
import SelectableAiPhotoTemplate from '../components/SelectableAiPhotoTemplate';
import { CustomAlert } from '../../../components/ui/feedback/CustomAlert';
import { Color } from '../../../constants/color.constant.ts';
import { useMediaStore } from '../../../stores/media.store';
import { useSelectionStore } from '../../../stores/selection.store';
import { AiPhotoTemplate } from '../../../types/external/ai-photo.type';
import { useAiPhotoTemplate } from '../../../service/gallery/ai-photo.query.hook.ts';
import { useCreateAiPhoto } from '../../../service/gallery/ai-photo.create.hook.ts';

const AiPhotoMakerPage = (): React.ReactElement => {
  // Refs
  const scrollRef = useRef<ScrollView>(null);

  // React hooks
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>(-1);

  // 글로벌 상태 관리 (Zustand)
  const gallery = useMediaStore(state => state.getGallery());
  const galleryIndex = useSelectionStore(state => state.currentGalleryIndex);

  // Custom hooks
  const { drivingVideos: aiPhotoTemplate } = useAiPhotoTemplate();
  const { submitWithParams: createAiPhoto } = useCreateAiPhoto({
    heroId: 0,
    galleryId: 0,
    drivingVideoId: 0,
  });

  const onClickMake = () => {
    if (!gallery[galleryIndex].id) {
      CustomAlert.simpleAlert('선택된 사진을 확인할 수 없습니다.');
      return false;
    }
    if (!selectedTemplateId) {
      CustomAlert.simpleAlert('움직임을 선택해 주세요.');
      return false;
    }

    // 실제 값들을 파라미터로 전달
    createAiPhoto({
      heroId: 0, // TODO: heroId 값 확인 필요
      galleryId: gallery[galleryIndex].id,
      drivingVideoId: selectedTemplateId,
    });
  };
  return (
    <LoadingContainer isLoading={false}>
      <ScreenContainer>
        <ScrollContentContainer>
          <ContentContainer withScreenPadding gap={20}>
            <ContentContainer
              flex={1}
              backgroundColor={Color.GREY_700}
              borderRadius={6}
              height={376}
            >
              <Photo
                resizeMode={'contain'}
                source={{
                  uri: gallery[galleryIndex].url,
                }}
              />
            </ContentContainer>
            <ContentContainer flex={1} expandToEnd>
              <Title color={Color.GREY_900}>움직임을 선택해 주세요</Title>
              <ScrollContentContainer
                useHorizontalLayout
                gap={6}
                ref={scrollRef}
              >
                {aiPhotoTemplate.map((item: AiPhotoTemplate) => {
                  return (
                    <SelectableAiPhotoTemplate
                      key={item.id}
                      onSelected={(item: AiPhotoTemplate) => {
                        setSelectedTemplateId(item.id);
                      }}
                      size={90}
                      data={item}
                      selected={
                        selectedTemplateId !== -1 &&
                        item.id === selectedTemplateId
                      }
                    />
                  );
                })}
              </ScrollContentContainer>
              <ContentContainer alignCenter paddingTop={20}>
                <AiPhotoMakerButton onPress={onClickMake} />
              </ContentContainer>
            </ContentContainer>
          </ContentContainer>
        </ScrollContentContainer>
      </ScreenContainer>
    </LoadingContainer>
  );
};
export default AiPhotoMakerPage;
