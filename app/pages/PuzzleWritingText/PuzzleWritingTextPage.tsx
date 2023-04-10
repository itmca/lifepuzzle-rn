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
    <>
      <View style={styles.container}>
        <HelpQuestion />
        <View style={{marginHorizontal: 16}}>
          <AdvancedTextInput
            customStyle={styles.titleInput}
            placeholder="제목을 입력해주세요."
            text={title}
            activeUnderlineColor={'white'}
            underlineColor={'white'}
            autoFocus={true}
            onChangeText={setTitle}
          />
        </View>
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}>
          <View style={{marginHorizontal: 16}}>
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
          </View>
        </KeyboardAwareScrollView>
      </View>
      <KeyboardAccessoryView
        alwaysVisible={true}
        hideBorder={true}
        androidAdjustResize={true}
        style={{backgroundColor: 'white'}}>
        <StoryKeyboardVoiceRecord />
      </KeyboardAccessoryView>
    </>
  );
};

export default PuzzleWritingTextPage;
