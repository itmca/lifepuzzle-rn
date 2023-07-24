import React, {useEffect, useState} from 'react';
import {useRecommendedQuestion} from '../../service/hooks/question.hook';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {helpQuestionTextState} from '../../recoils/help-question.recoil';
import {helpQuestionState} from '../../recoils/story-writing.recoil';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useFocusAction} from '../../service/hooks/screen.hook';
import {SmallText} from '../../components/styled/components/Text';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {SmallTitle} from '../../components/styled/components/Title';
import dayjs from 'dayjs';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {Color} from '../../constants/color.constant';
import {RecommendQuestionButton} from '../../components/button/RecommendQuestionButton';
import {ScrollContainer} from '../../components/styled/container/ScrollContainer';
import {Question} from '../../types/question.type';

const StoryWritingQuestionPage = (): JSX.Element => {
  const setHelpQuestionText = useSetRecoilState(helpQuestionTextState);

  const [storyQuestion, setStoryQuestion] = useRecoilState(helpQuestionState);
  const [selectedQuestion, setSelectedQuestion] = useState<
    Question | undefined
  >(undefined);

  useFocusAction(() => {
    setHelpQuestionText(storyQuestion?.helpQuestionText || '');
  });

  useEffect(() => {
    if (!selectedQuestion) {
      setStoryQuestion(undefined);
      setHelpQuestionText('');
      return;
    }

    setStoryQuestion({
      recQuestionNo: selectedQuestion.no,
      helpQuestionText: selectedQuestion.text,
      recQuestionModified: false,
    });

    setHelpQuestionText(selectedQuestion.text);
  }, [selectedQuestion]);

  const [recommendQuestions, isLoading] = useRecommendedQuestion();

  const thisMonth = dayjs().format('M');

  return (
    <>
      <ScreenContainer style={{height: 96}}>
        <ContentContainer>
          <SmallTitle>{thisMonth}월의 추천질문</SmallTitle>
        </ContentContainer>
        <ContentContainer>
          <SmallText color={Color.DARK_GRAY}>이번달 추천질문입니다.</SmallText>
          <SmallText color={Color.DARK_GRAY}>
            이번달도 아름다운 퍼즐을 맞춰보아요!
          </SmallText>
        </ContentContainer>
      </ScreenContainer>
      <LoadingContainer isLoading={isLoading}>
        <ScrollContainer style={{height: '100%', backgroundColor: Color.WHITE}}>
          <ScreenContainer style={{flex: 1, height: '100%'}}>
            <ContentContainer
              style={{alignItems: 'flex-start', height: '100%'}}
              gap={'10px'}>
              {recommendQuestions.map((question, index) => (
                <RecommendQuestionButton
                  order={index + 1}
                  question={question}
                  selected={
                    selectedQuestion !== undefined &&
                    selectedQuestion.no === question.no
                  }
                  onSelect={() => {
                    setSelectedQuestion(question);
                  }}
                />
              ))}
            </ContentContainer>
          </ScreenContainer>
        </ScrollContainer>
      </LoadingContainer>
    </>
  );
};

export default StoryWritingQuestionPage;
