import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {useRecoilState} from 'recoil';
import {writingStoryState} from '../../recoils/story-write.recoil';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import StoryDateInput from './StoryDateInput';
import {useKeyboardVisible} from '../../service/hooks/keyboard';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useIsStoryUploading} from '../../service/hooks/story.write.hook';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {StoryWritingMenu} from '../../components/story/StoryWritingMenu';
import {ScrollView} from 'react-native-gesture-handler';
import {Color} from '../../constants/color.constant';
import {MediumImage} from '../../components/styled/components/Image.tsx';

const StoryWritingMainPage = (): JSX.Element => {
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
  const isKeyboardVisible = useKeyboardVisible();
  const isStoryUploading = useIsStoryUploading();

  return (
    <LoadingContainer isLoading={isStoryUploading}>
      <BottomSheetModalProvider>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScreenContainer>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
              style={{
                borderTopWidth: 1,
                borderTopColor: Color.LIGHT_GRAY,
                backgroundColor: 'transparent',
                width: '100%',
                height: '100%',
              }}>
              <ContentContainer height={'100%'} gap={0}>
                <ContentContainer
                  flex={1}
                  maxHeight={'40%'}
                  backgroundColor={Color.BLACK}>
                  {writingStory.photos && writingStory.photos[0] ? (
                    <MediumImage
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      source={{uri: writingStory.photos[0].node.image.uri}}
                    />
                  ) : (
                    // TODO(border-line): 화면 레이아웃을 위해 테스트로 추가된 것으로 홈 V2 API 연결 후 삭제
                    <MediumImage
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      source={{
                        // short height photo
                        // uri: 'https://cdn.pixabay.com/photo/2022/09/29/03/17/baby-7486419_1280.jpg',
                        // long height photo
                        uri: 'https://cdn.pixabay.com/photo/2023/12/14/20/24/christmas-balls-8449615_1280.jpg',
                      }}
                      resizeMode={'contain'}
                    />
                  )}
                </ContentContainer>
                <ContentContainer expandToEnd withScreenPadding>
                  <ContentContainer>
                    <StoryDateInput
                      value={writingStory.date}
                      onChange={(date: Date) => {
                        setWritingStory({date});
                      }}
                    />
                  </ContentContainer>
                  <ContentContainer>
                    <BasicTextInput
                      customStyle={{height: 40, lineHeight: 40}}
                      placeholder="제목을 입력해주세요"
                      text={writingStory.title ?? ''}
                      onChangeText={text => {
                        setWritingStory({title: text});
                      }}
                      mode={'outlined'}
                      underlineColor={'transparent'}
                      activeUnderlineColor={'transparent'}
                      borderColor={'transparent'}
                      backgroundColor={'transparent'}
                    />
                  </ContentContainer>
                  <ScrollView
                    style={{flex: 1}}
                    contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps={'always'}>
                    <ContentContainer expandToEnd>
                      <BasicTextInput
                        customStyle={{flex: 1}}
                        placeholder="사진과 관련된 이야기를 기록해보세요"
                        text={writingStory.storyText ?? ''}
                        onChangeText={text => {
                          setWritingStory({storyText: text});
                        }}
                        multiline={true}
                        mode={'outlined'}
                        borderColor={'transparent'}
                        backgroundColor={'transparent'}
                      />
                    </ContentContainer>
                  </ScrollView>
                </ContentContainer>
                <StoryWritingMenu keyboardVisible={isKeyboardVisible} />
              </ContentContainer>
            </KeyboardAvoidingView>
          </ScreenContainer>
        </TouchableWithoutFeedback>
      </BottomSheetModalProvider>
    </LoadingContainer>
  );
};

export default StoryWritingMainPage;
