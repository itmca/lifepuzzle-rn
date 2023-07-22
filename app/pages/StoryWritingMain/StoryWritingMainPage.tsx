import React, {useEffect, useState} from 'react';

import {Image, View} from 'react-native';
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
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {helpQuestionTextState} from '../../recoils/help-question.recoil';
import Text, {
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
import MediumText from '../../components/styled/components/Text';
import {
  MediumImage,
  SmallImage,
} from '../../components/styled/components/Image';

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
            style={{marginLeft: 10}}>
            이번달 추천질문
          </SmallText>
        </ScreenContainer>
        <OutLineContentContainer style={styles.screenLTopContainer}>
          <List.Accordion
            title={<MediumText fontWeight={800}>{helpQuestion}</MediumText>}
            right={props => (
              <SmallImage
                tintColor={Color.DARK_GRAY}
                source={
                  props.isExpanded
                    ? require('../../assets/images/chevron_left.png')
                    : require('../../assets/images/chevron_right.png')
                }
              />
            )}
            onPress={() => {
              numberOfLines == 1 ? setNumberOfLines(0) : setNumberOfLines(1);
            }}
            titleNumberOfLines={numberOfLines}
            style={styles.helpQuestionContainer}
            theme={{colors: {background: 'transparent'}}}></List.Accordion>
          <Image
            source={require('../../assets/images/puzzle-character.png')}
            style={{position: 'absolute', top: -45, right: 5}}
          />
        </OutLineContentContainer>
        <ScreenContainer style={styles.screenCenterContainer}>
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
        </ScreenContainer>
        <ScreenContainer style={styles.screenBottomContainer}>
          <BasicTextInput
            customStyle={{flex: 1}}
            placeholder="본문에 새로운 이야기를 작성해보세요!"
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
    </LoadingContainer>
  );
};

export default StoryWritingMainPage;
