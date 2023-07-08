import React, {useEffect, useState} from 'react';

import {Dimensions, Keyboard, View} from 'react-native';
import styles from './styles';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {
  storyDateState,
  storyTextState,
  writingStoryState,
} from '../../recoils/story-writing.recoil';
import {
  NoOutLineFullScreenContainer,
  ScreenContainer,
} from '../../components/styled/container/ScreenContainer';
import {StoryKeyboard} from '../../components/story/StoryKeyboard';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {useSaveStory} from '../../service/hooks/story.write.hook';
import {helpQuestionTextState} from '../../recoils/help-question.recoil';
import Text, {SmallText} from '../../components/styled/components/Text';
import StoryDateInput from '../../components/story/StoryDateInput';

const DeviceWidth = Dimensions.get('window').width;

const PuzzleWritingTextPage = (): JSX.Element => {
  const helpQuestion = useRecoilValue(helpQuestionTextState);
  const [title, setTitle] = useState<string>('');
  const [storyText, setStoryText] = useState<string>('');
  const [_, setStoryDate] = useRecoilState<Date | undefined>(storyDateState);
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
    <NoOutLineFullScreenContainer>
      <ScreenContainer style={styles.screenTopContainer}>
        <StoryDateInput date={new Date()} onChange={setStoryDate} />
        <View flex={1.5}></View>
        <View style={styles.helpQuestionContainer}>
          <Text style={styles.helpQuestionText}>이번달 추천질문</Text>
          <SmallText style={styles.helpQuestionText}> 더보기</SmallText>
        </View>
      </ScreenContainer>
      <ScreenContainer style={styles.screenBottomContainer}>
        <BasicTextInput
          customStyle={styles.titleInput}
          placeholder="제목을 입력해주세요."
          text={title}
          autoFocus={true}
          onChangeText={setTitle}
          mode={'outlined'}
          underlineColor={'transparent'}
          activeUnderlineColor={'transparent'}
        />
        <BasicTextInput
          customStyle={styles.contentInput}
          placeholder="본문에 새로운 이야기를 작성해보세요!"
          text={storyText}
          onChangeText={setStoryText}
          multiline={true}
          mode={'outlined'}
          maxLength={500}
        />
      </ScreenContainer>
      {<StoryKeyboard />}
    </NoOutLineFullScreenContainer>
  );
};

export default PuzzleWritingTextPage;
