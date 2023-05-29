import React, {useEffect, useState} from 'react';

import {View} from 'react-native';
import {KeyboardAccessoryView} from 'react-native-keyboard-accessory';
import styles from './styles';
import HelpQuestion from '../../components/help-question/HelpQuestion';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  storyTextState,
  writingStoryState,
} from '../../recoils/story-writing.recoil';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AdvancedTextInput} from '../../components/input/AdvancedTextInput';
import {StoryKeyboardVoiceRecord} from '../../components/story/StoryKeyboardVoiceRecord';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer';

const PuzzleWritingTextPage = (): JSX.Element => {
  const [title, setTitle] = useState<string>('');
  const [storyText, setStoryText] = useState<string>('');

  const writingStory = useRecoilValue(writingStoryState);
  const setStoryTextInfo = useSetRecoilState(storyTextState);

  useEffect(() => {
    setTitle(writingStory?.title || '');
    setStoryText(writingStory?.storyText || '');
  }, []);

  useEffect(() => {
    setStoryTextInfo({
      title: title,
      storyText: storyText,
    });
  }, [title, storyText]);

  return (
    <ScreenContainer>
      <ContentContainer gap="16px" flex={1}>
        <HelpQuestion />
        <AdvancedTextInput
          customStyle={styles.titleInput}
          placeholder="제목을 입력해주세요."
          text={title}
          activeUnderlineColor={'white'}
          underlineColor={'white'}
          autoFocus={true}
          onChangeText={setTitle}
        />
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}>
          <AdvancedTextInput
            customStyle={styles.contentInput}
            activeUnderlineColor="white"
            underlineColor="white"
            placeholder="여기를 눌러 새로운 인생조각을 얘기해주세요."
            text={storyText}
            scrollEnabled={false}
            onChangeText={setStoryText}
            multiline={true}
          />
        </KeyboardAwareScrollView>
      </ContentContainer>
      <ContentContainer>
        <KeyboardAccessoryView
          alwaysVisible={true}
          hideBorder={true}
          androidAdjustResize={true}
          style={{backgroundColor: 'white'}}>
          <StoryKeyboardVoiceRecord />
        </KeyboardAccessoryView>
      </ContentContainer>
    </ScreenContainer>
  );
};

export default PuzzleWritingTextPage;
