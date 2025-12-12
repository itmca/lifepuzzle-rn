import React, { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import StoryDateInput from './StoryDateInput.tsx';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer';
import { useIsStoryUploading } from '../../../services/story/story.mutation';

import { Color } from '../../../constants/color.constant.ts';
import {
  CONTAINER_WIDTH_STANDARD,
  MAX_CAROUSEL_HEIGHT,
} from '../../../constants/carousel.constant.ts';
import { AdaptiveImage } from '../../../components/ui/base/ImageBase';
import { useStoryStore } from '../../../stores/story.store';
import { useMediaStore } from '../../../stores/media.store';
import { GalleryItem } from '../../../types/core/writing-story.type';
import { PlainTextInput } from '../../../components/ui/form/TextInput.tsx';
import { VoiceAddButton } from '../../../components/feature/voice/VoiceAddButton';
import TextAreaInput from '../../../components/ui/form/TextAreaInput';
import { VoiceBottomSheet } from '../../../components/feature/story/VoiceBottomSheet.tsx';
import { AudioBtn } from '../../../components/feature/story/AudioBtn.tsx';
import { Divider } from '../../../components/ui/base/Divider';
import { useStoryWritingDimensions } from '../../../hooks/useStoryWritingDimensions';
import { TagSelector } from './components/TagSelector';

const StoryWritingPage = (): React.ReactElement => {
  // React hooks
  const [openModal, setOpenModal] = useState<boolean>(false);

  // 글로벌 상태 관리 (Zustand)
  const writingStory = useStoryStore(state => state.writingStory);
  const setWritingStory = useStoryStore(state => state.setWritingStory);
  const ageGroups = useMediaStore(state => state.ageGroups ?? undefined);
  const tags = useMediaStore(state => state.tags ?? undefined);

  // Custom hooks
  const isStoryUploading = useIsStoryUploading();
  const insets = useSafeAreaInsets();

  const galleryItem = writingStory.gallery?.[0];

  // Use consolidated hook for all dimension and age group calculations
  const {
    imageDimensions,
    ageGroupStartDate,
    ageGroupEndDate,
    defaultTagIndex,
  } = useStoryWritingDimensions({
    galleryItem,
    ageGroups,
    tags,
    containerWidth: CONTAINER_WIDTH_STANDARD,
    maxHeight: MAX_CAROUSEL_HEIGHT,
  });

  // Early return after all hooks
  if (!galleryItem) {
    return <></>;
  }

  return (
    <PageContainer isLoading={isStoryUploading}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ContentContainer height={'100%'} paddingBottom={15}>
          <ScrollContainer
            keyboardAware
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: 15,
            }}
          >
            <ContentContainer paddingHorizontal={20}>
              <TagSelector
                tags={tags || []}
                defaultIndex={defaultTagIndex}
                onSelect={selectedItem => {
                  const gallery: GalleryItem[] =
                    writingStory.gallery?.map(i => ({
                      ...i,
                      tagKey: selectedItem.key,
                    })) ?? [];
                  setWritingStory({ gallery });
                }}
              />
            </ContentContainer>

            <ContentContainer
              paddingVertical={8}
              paddingHorizontal={20}
              alignItems="center"
            >
              {imageDimensions ? (
                <View
                  style={{
                    width: imageDimensions.width,
                    height: imageDimensions.height,
                    borderRadius: 16,
                    overflow: 'hidden',
                  }}
                >
                  <AdaptiveImage
                    uri={galleryItem.uri}
                    resizeMode="contain"
                    borderRadius={0}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    width: CONTAINER_WIDTH_STANDARD,
                    height: MAX_CAROUSEL_HEIGHT,
                    borderRadius: 16,
                    backgroundColor: Color.GREY_200,
                  }}
                />
              )}
            </ContentContainer>

            <ContentContainer
              flex={1}
              paddingHorizontal={20}
              paddingTop={4}
              gap={0}
            >
              <Divider marginVertical={0} paddingHorizontal={16} height={3} />
              <ContentContainer flex={1} paddingTop={24}>
                <PlainTextInput
                  text={writingStory.title ?? ''}
                  onChangeText={text => {
                    setWritingStory({ title: text });
                  }}
                  placeholder={'제목을 입력해주세요'}
                  validations={[
                    {
                      condition: (text: string) => !!text,
                      errorText: '제목을 입력해주세요',
                    },
                  ]}
                />
                <ContentContainer
                  flex={1}
                  minHeight="120px"
                  backgroundColor={Color.GREY}
                >
                  <TextAreaInput
                    text={writingStory.content ?? ''}
                    onChangeText={text => {
                      setWritingStory({ content: text });
                    }}
                    placeholder={'내용을 입력해주세요'}
                    validations={[
                      {
                        condition: (text: string) => !!text,
                        errorText: '내용을 입력해주세요',
                      },
                    ]}
                  />
                </ContentContainer>
              </ContentContainer>
            </ContentContainer>

            <ContentContainer
              paddingHorizontal={20}
              paddingTop={24}
              paddingBottom={insets.bottom + 20}
            >
              {writingStory.voice ? (
                <AudioBtn
                  audioUrl={writingStory.voice}
                  onPlay={() => {
                    setOpenModal(true);
                  }}
                />
              ) : (
                <VoiceAddButton
                  onPress={() => {
                    setOpenModal(true);
                  }}
                />
              )}
              <StoryDateInput
                startDate={ageGroupStartDate}
                endDate={ageGroupEndDate}
                value={writingStory.date || ageGroupStartDate}
                onChange={(date: Date) => {
                  setWritingStory({ date });
                }}
              />
            </ContentContainer>
          </ScrollContainer>
        </ContentContainer>
      </TouchableWithoutFeedback>
      <VoiceBottomSheet
        opened={openModal}
        editable
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </PageContainer>
  );
};

export default StoryWritingPage;
