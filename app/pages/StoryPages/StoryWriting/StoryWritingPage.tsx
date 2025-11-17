import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

import StoryDateInput from './StoryDateInput.tsx';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer';
import { useIsStoryUploading } from '../../../service/story/story.write.hook.ts';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { Color } from '../../../constants/color.constant.ts';
import { MediumImage } from '../../../components/ui/base/ImageBase';
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
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { VoiceBottomSheet } from '../../../components/feature/story/VoiceBottomSheet.tsx';
import { AudioBtn } from '../../../components/feature/story/AudioBtn.tsx';

const StoryWritingPage = (): React.ReactElement => {
  // Refs
  const carouselRef = useRef<ICarouselInstance>(null);

  // React hooks
  const [openModal, setOpenModal] = useState<boolean>(false);

  // 글로벌 상태 관리 (Zustand)
  const writingStory = useStoryStore(state => state.writingStory);
  const setWritingStory = useStoryStore(state => state.setWritingStory);
  const playInfo = useStoryStore(state => state.playInfo);
  const setPlayInfo = useStoryStore(state => state.setPlayInfo);
  const ageGroups = useMediaStore(state => state.ageGroups);
  const tags = useMediaStore(state => state.tags);

  // Custom hooks
  const isStoryUploading = useIsStoryUploading();
  if (!writingStory.gallery || writingStory.gallery.length === 0) {
    return <></>;
  }

  const galleryItem = writingStory.gallery[0];
  const currentAgeGroup = ageGroups[galleryItem.tagKey];
  const ageGroupStartDate =
    currentAgeGroup && new Date(Date.UTC(currentAgeGroup.startYear, 0, 1));
  const ageGroupEndDate =
    currentAgeGroup && new Date(Date.UTC(currentAgeGroup.endYear, 11, 31));

  return (
    <LoadingContainer isLoading={isStoryUploading}>
      <BottomSheetModalProvider>
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
                    data={tags}
                    onSelect={(selectedItem, index) => {
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
                    renderItem={(item, index, isSelected) => {
                      return (
                        <ContentContainer withContentPadding gap={8}>
                          <Title color={Color.GREY_700}>{item.label}</Title>
                        </ContentContainer>
                      );
                    }}
                    showsVerticalScrollIndicator={false}
                  />
                </ContentContainer>

                <Carousel
                  ref={carouselRef}
                  data={[galleryItem]}
                  mode={'parallax'}
                  loop={false}
                  defaultIndex={0}
                  modeConfig={{
                    parallaxScrollingScale: 0.91,
                    parallaxAdjacentItemScale: 0.91,
                    parallaxScrollingOffset: 25,
                  }}
                  width={Dimensions.get('window').width}
                  height={Dimensions.get('window').height * 0.52}
                  renderItem={({ item: data }: any) => {
                    return (
                      <ContentContainer
                        borderRadius={6}
                        alignCenter
                        backgroundColor={Color.GREY_700}
                      >
                        <MediumImage
                          style={{
                            width: '100%',
                            height: '100%',
                          }}
                          source={{ uri: data.uri }}
                          resizeMode={'contain'}
                        />
                      </ContentContainer>
                    );
                  }}
                />

                <ContentContainer flex={1} paddingHorizontal={20}>
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
                    minHeight={100}
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
      </BottomSheetModalProvider>
    </LoadingContainer>
  );
};

export default StoryWritingPage;
