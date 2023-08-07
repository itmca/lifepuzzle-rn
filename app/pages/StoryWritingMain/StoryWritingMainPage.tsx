import React, {useEffect, useState} from 'react';

import {Keyboard, TouchableWithoutFeedback} from 'react-native';
import styles from './styles';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {
  storyDateState,
  storyTextState,
  writingStoryState,
  isModalOpening,
} from '../../recoils/story-writing.recoil';
import {
  NoOutLineFullScreenContainer,
  ScreenContainer,
} from '../../components/styled/container/ScreenContainer';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {helpQuestionTextState} from '../../recoils/help-question.recoil';
import MediumText, {
  LargeText,
  SmallText,
} from '../../components/styled/components/Text';
import StoryDateInput from '../../components/story/StoryDateInput';
import {useKeyboardVisible} from '../../service/hooks/keyboard';
import {List} from 'react-native-paper';
import {StoryKeyboardPhotoRecord} from '../../components/story/StoryKeyboardPhotoRecord';
import {StoryKeyboardVideoRecord} from '../../components/story/StoryKeyboardVideoRecord';
import {StoryKeyboardVoiceRecord} from '../../components/story/StoryKeyboardVoiceRecord';
import {
  ContentContainer,
  OutLineContentContainer,
} from '../../components/styled/container/ContentContainer';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useIsStoryUploading} from '../../service/hooks/story.write.hook';
import {Color} from '../../constants/color.constant';
import {MediumImage} from '../../components/styled/components/Image';

const StoryWritingMainPage = (): JSX.Element => {
  const [numberOfLines, setNumberOfLines] = useState<number>(1);
  const helpQuestion = useRecoilValue(helpQuestionTextState);
  const [title, setTitle] = useState<string>('');
  const [storyText, setStoryText] = useState<string>('');
  const [_, setStoryDate] = useRecoilState<Date | undefined>(storyDateState);
  const writingStory = useRecoilValue(writingStoryState);
  const setStoryTextInfo = useSetRecoilState(storyTextState);
  const isKeyboardVisible = useKeyboardVisible();
  const isStoryUploading = useIsStoryUploading();
  const setIsModalOpening = useSetRecoilState(isModalOpening);

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
    <LoadingContainer isLoading={isStoryUploading}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <NoOutLineFullScreenContainer>
          <ScreenContainer style={styles.screenHTopContainer}>
            <StoryDateInput
              date={new Date()}
              onChange={setStoryDate}
              style={styles.dateInput}
            />
            <SmallText
              color={Color.WHITE}
              fontWeight={700}
              style={{marginLeft: 15}}>
              이번달 추천질문
            </SmallText>
          </ScreenContainer>
          <OutLineContentContainer style={styles.screenLTopContainer}>
            <List.Accordion
              title={
                <LargeText fontWeight={700} lineHeight={'21px'}>
                  {helpQuestion}
                </LargeText>
              }
              right={() => <></>}
              onPress={() => {
                numberOfLines == 1 ? setNumberOfLines(0) : setNumberOfLines(1);
              }}
              titleNumberOfLines={numberOfLines}
              style={styles.helpQuestionContainer}
              theme={{colors: {background: 'transparent'}}}></List.Accordion>
            <MediumImage
              width={55}
              height={55}
              source={require('../../assets/images/puzzle-character.png')}
              style={{position: 'absolute', top: -45, right: 10}}
            />
          </OutLineContentContainer>
          <ScreenContainer style={styles.screenCenterContainer}>
            <BasicTextInput
              customStyle={styles.titleInput}
              placeholder="제목을 입력해주세요."
              text={title}
              onChangeText={setTitle}
              mode={'outlined'}
              underlineColor={'transparent'}
              activeUnderlineColor={'transparent'}
            />
          </ScreenContainer>
          <ScreenContainer style={styles.screenBottomContainer}>
            <BasicTextInput
              customStyle={{flex: 1}}
              placeholder="글작성을 완료해서 퍼즐을 맞춰보세요!"
              text={storyText}
              onChangeText={setStoryText}
              multiline={true}
              mode={'outlined'}
              maxLength={500}
            />
          </ScreenContainer>
          <ContentContainer>
            {!isKeyboardVisible && (
              <List.Section
                style={{borderTopColor: Color.LIGHT_GRAY, borderTopWidth: 8}}>
                <StoryKeyboardPhotoRecord></StoryKeyboardPhotoRecord>
                <StoryKeyboardVideoRecord></StoryKeyboardVideoRecord>
                <StoryKeyboardVoiceRecord></StoryKeyboardVoiceRecord>
              </List.Section>
            )}
          </ContentContainer>
        </NoOutLineFullScreenContainer>
      </TouchableWithoutFeedback>
    </LoadingContainer>
  );
};

export default StoryWritingMainPage;
