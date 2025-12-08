import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';

import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer';
import { ScreenContainer } from '../../../components/ui/layout/ScreenContainer';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../components/ui/layout/ContentContainer.tsx';
import { Title } from '../../../components/ui/base/TextBase';
import { AdaptiveImage } from '../../../components/ui/base/ImageBase';
import { AiPhotoMakerButton } from './components/AiPhotoMakerButton';
import SelectableAiPhotoTemplate from './components/SelectableAiPhotoTemplate';
import { CustomAlert } from '../../../components/ui/feedback/CustomAlert';
import { Color } from '../../../constants/color.constant.ts';
import { useMediaStore } from '../../../stores/media.store';
import { useSelectionStore } from '../../../stores/selection.store';
import { AiPhotoTemplate } from '../../../types/external/ai-photo.type';
import { useAiPhotoTemplate } from '../../../services/gallery/ai-photo.query.hook.ts';
import { useCreateAiPhoto } from '../../../services/gallery/ai-photo.create.hook.ts';
import Icon from '@react-native-vector-icons/material-icons';

const AiPhotoMakerPage = (): React.ReactElement => {
  // Refs
  const scrollRef = useRef<ScrollView>(null);

  // React hooks
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>(-1);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // 글로벌 상태 관리 (Zustand)
  const gallery = useMediaStore(state => state.gallery);
  const galleryIndex = useSelectionStore(state => state.currentGalleryIndex);

  // Custom hooks
  const { drivingVideos: aiPhotoTemplate } = useAiPhotoTemplate();
  const { submitWithParams: createAiPhoto } = useCreateAiPhoto({
    heroId: 0,
    galleryId: 0,
    drivingVideoId: 0,
  });

  // Handlers
  const handleTemplateSelect = useCallback((item: AiPhotoTemplate) => {
    setSelectedTemplateId(item.id);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

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
      <ScreenContainer edges={['left', 'right', 'bottom']}>
        <ScrollContentContainer>
          <ContentContainer withScreenPadding gap={20}>
            <ContentContainer
              flex={1}
              backgroundColor={Color.GREY_700}
              borderRadius={6}
              height={376}
            >
              <AdaptiveImage
                uri={gallery[galleryIndex].url}
                resizeMode="contain"
              />
            </ContentContainer>
            <ContentContainer flex={1} expandToEnd>
              <ContentContainer
                useHorizontalLayout
                alignItems="center"
                justifyContent="space-between"
              >
                <Title color={Color.GREY_900}>움직임을 선택해 주세요</Title>
                <TouchableOpacity onPress={toggleMute} activeOpacity={0.7}>
                  <ContentContainer
                    useHorizontalLayout
                    alignItems="center"
                    backgroundColor="transparent"
                  >
                    <Icon
                      name={isMuted ? 'volume-off' : 'volume-up'}
                      size={24}
                      color={Color.GREY_900}
                    />
                  </ContentContainer>
                </TouchableOpacity>
              </ContentContainer>
              <ScrollContentContainer
                useHorizontalLayout
                gap={6}
                ref={scrollRef}
              >
                {aiPhotoTemplate.map((item: AiPhotoTemplate) => {
                  return (
                    <SelectableAiPhotoTemplate
                      key={item.id}
                      onSelected={handleTemplateSelect}
                      size={90}
                      data={item}
                      selected={
                        selectedTemplateId !== -1 &&
                        item.id === selectedTemplateId
                      }
                      muted={isMuted}
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
