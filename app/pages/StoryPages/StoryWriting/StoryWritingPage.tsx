import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

import StoryDateInput from './StoryDateInput.tsx';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer';
import { useIsStoryUploading } from '../../../service/story/story.write.hook.ts';

import { Color } from '../../../constants/color.constant.ts';
import { useStoryStore } from '../../../stores/story.store';
import { useMediaStore } from '../../../stores/media.store';
import SelectDropdown from 'react-native-select-dropdown';
import { GalleryItem } from '../../../types/core/writing-story.type';
import { SvgIcon } from '../../../components/ui/display/SvgIcon';
import { Title } from '../../../components/ui/base/TextBase';
import { PlainTextInput } from '../../../components/ui/form/TextInput.tsx';
import { VoiceAddButton } from '../../../components/feature/voice/VoiceAddButton';
import TextAreaInput from '../../../components/ui/form/TextAreaInput';
import { ScrollView } from 'react-native-gesture-handler';
import { VoiceBottomSheet } from '../../../components/feature/story/VoiceBottomSheet.tsx';
import { AudioBtn } from '../../../components/feature/story/AudioBtn.tsx';
import { MediaCarousel } from '../../../components/feature/story/MediaCarousel.tsx';
import { Divider } from '../../../components/ui/base/Divider';
import logger from '../../../utils/logger';

const StoryWritingPage = (): React.ReactElement => {
  // React hooks
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [imageDimensions, setImageDimensions] = useState<
    { width: number; height: number }[]
  >([]);

  // 글로벌 상태 관리 (Zustand)
  const writingStory = useStoryStore(state => state.writingStory);
  const setWritingStory = useStoryStore(state => state.setWritingStory);
  const ageGroups = useMediaStore(state => state.ageGroups);
  const tags = useMediaStore(state => state.tags);

  // Custom hooks
  const isStoryUploading = useIsStoryUploading();

  // Constants
  const MAX_CAROUSEL_HEIGHT = 280;
  const CAROUSEL_WIDTH = Dimensions.get('window').width;

  // Memoized carousel data
  const carouselData = useMemo(
    () =>
      writingStory.gallery?.map((item, index) => ({
        type: 'IMAGE',
        url: item.uri,
        index: index,
        width: imageDimensions[index]?.width,
        height: imageDimensions[index]?.height,
      })) ?? [],
    [writingStory.gallery, imageDimensions],
  );

  // 이미지 비율에 맞는 최적의 캐러셀 높이 계산
  const optimalCarouselHeight = useMemo(() => {
    if (imageDimensions.length === 0) {
      return MAX_CAROUSEL_HEIGHT;
    }

    // 각 이미지가 CAROUSEL_WIDTH에 맞춰졌을 때의 높이 계산
    const heights = imageDimensions.map(dim => {
      const aspectRatio = dim.height / dim.width;
      return CAROUSEL_WIDTH * aspectRatio;
    });

    // 모든 이미지의 최대 높이 (하지만 MAX_CAROUSEL_HEIGHT를 초과하지 않음)
    const maxHeight = Math.max(...heights);
    return Math.min(maxHeight, MAX_CAROUSEL_HEIGHT);
  }, [imageDimensions, CAROUSEL_WIDTH, MAX_CAROUSEL_HEIGHT]);

  // 이미지 크기를 가져와서 최적의 캐러셀 높이 계산
  useEffect(() => {
    const loadImageDimensions = async () => {
      if (!writingStory.gallery) {
        return;
      }

      const dimensions = await Promise.all(
        writingStory.gallery.map(async item => {
          const uri = item.uri;

          try {
            return await new Promise<{ width: number; height: number }>(
              (resolve, reject) => {
                Image.getSize(
                  uri,
                  (w, h) => resolve({ width: w, height: h }),
                  reject,
                );
              },
            );
          } catch (error) {
            logger.debug('Failed to get image size:', uri, error);
            return { width: CAROUSEL_WIDTH, height: MAX_CAROUSEL_HEIGHT };
          }
        }),
      );
      setImageDimensions(dimensions);
    };

    loadImageDimensions();
  }, [writingStory.gallery, CAROUSEL_WIDTH, MAX_CAROUSEL_HEIGHT]);

  // Early return after all hooks
  if (!writingStory.gallery || writingStory.gallery.length === 0) {
    return <></>;
  }

  const galleryItem = writingStory.gallery[0];
  const currentAgeGroup = ageGroups?.[galleryItem.tagKey];
  const ageGroupStartDate =
    currentAgeGroup && new Date(Date.UTC(currentAgeGroup.startYear, 0, 1));
  const ageGroupEndDate =
    currentAgeGroup && new Date(Date.UTC(currentAgeGroup.endYear, 11, 31));

  return (
    <LoadingContainer isLoading={isStoryUploading}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          backgroundColor: 'transparent',
          flex: 1,
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ContentContainer height={'100%'} paddingBottom={15}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                paddingTop: 15,
              }}
              keyboardShouldPersistTaps={'handled'}
            >
              <ContentContainer paddingHorizontal={20}>
                <SelectDropdown
                  data={tags || []}
                  onSelect={(selectedItem, _) => {
                    const gallery: GalleryItem[] =
                      writingStory.gallery?.map(i => ({
                        ...i,
                        tagKey: selectedItem.key,
                      })) ?? [];
                    setWritingStory({ gallery });
                  }}
                  renderButton={(selectedItem, isOpened) => {
                    return (
                      <ContentContainer
                        gap={8}
                        style={{
                          height: 24,
                          flexDirection: 'row',
                          alignItems: 'center',
                          alignSelf: 'flex-start',
                        }}
                      >
                        <Title
                          color={
                            selectedItem && selectedItem.label
                              ? Color.GREY_700
                              : Color.GREY_400
                          }
                        >
                          {(selectedItem && selectedItem.label) || '나이대'}
                        </Title>
                        <SvgIcon
                          name={isOpened ? 'chevronUp' : 'chevronDown'}
                        />
                      </ContentContainer>
                    );
                  }}
                  dropdownStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 2,
                    width: 70,
                  }}
                  dropdownOverlayColor={'transparent'}
                  renderItem={(item, _index, _isSelected) => {
                    return (
                      <ContentContainer withContentPadding gap={8}>
                        <Title color={Color.GREY_700}>{item.label}</Title>
                      </ContentContainer>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                />
              </ContentContainer>

              <ContentContainer paddingVertical={4}>
                <MediaCarousel
                  key={`carousel-${writingStory.gallery.length}-${galleryItem.id ?? 'empty'}`}
                  data={carouselData}
                  activeIndex={0}
                  carouselWidth={CAROUSEL_WIDTH}
                  carouselMaxHeight={optimalCarouselHeight}
                />
              </ContentContainer>

              <ContentContainer
                flex={1}
                paddingHorizontal={20}
                paddingTop={4}
                gap={0}
              >
                <Divider marginVertical={0} paddingHorizontal={16} height={3} />
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
                  minHeight="100px"
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
                  value={''}
                  onChange={(date: Date) => {
                    setWritingStory({ date });
                  }}
                />
              </ContentContainer>
            </ScrollView>
          </ContentContainer>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <VoiceBottomSheet
        opened={openModal}
        editable
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </LoadingContainer>
  );
};

export default StoryWritingPage;
