import React, {useEffect, useState} from 'react';
import {useRecommendedQuestion} from '../../service/hooks/question.hook';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {
  helpQuestionOpenState,
  helpQuestionTextState,
} from '../../recoils/help-question.recoil';
import {helpQuestionState} from '../../recoils/story-writing.recoil';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useLoginChecking} from '../../service/hooks/login.hook';
import {useFocusAction} from '../../service/hooks/screen.hook';
import {SmallText} from '../../components/styled/components/Text';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import Title from '../../components/styled/components/Title';
import dayjs from 'dayjs';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {Color} from '../../constants/color.constant';
import {RecommendQuestionButton} from '../../components/button/RecommendQuestionButton';
import {ScrollContainer} from '../../components/styled/container/ScrollContainer';
import {Question} from '../../types/question.type';

const PuzzleWritingQuestionPage = (): JSX.Element => {
  const [helpQuestionText, setHelpQuestionText] = useRecoilState(
    helpQuestionTextState,
  );
  const setHelpQuestionOpen = useSetRecoilState(helpQuestionOpenState);
  const [storyQuestion, setStoryQuestion] = useRecoilState(helpQuestionState);
  const [selectedQuestion, setSelectedQuestion] = useState<
    Question | undefined
  >(undefined);

  useLoginChecking({
    alertTitle: '미로그인 시점에 작성한 이야기는 저장되지 않습니다',
  });

  useFocusAction(() => {
    setHelpQuestionOpen(true);
    setHelpQuestionText(storyQuestion?.helpQuestionText || '');
  });

  useEffect(() => {
    if (!selectedQuestion) {
      setStoryQuestion(undefined);
      setHelpQuestionText('');
      return;
    }

    setStoryQuestion({
      recQuestionNo: selectedQuestion.questionNo,
      helpQuestionText: selectedQuestion.questionText,
      recQuestionModified: false,
    });

    setHelpQuestionText(selectedQuestion.questionText);
  }, [selectedQuestion]);

  const [recommendQuestions, isLoading] = useRecommendedQuestion();

  const thisMonth = dayjs().format('M');

  return (
    <>
      <ScreenContainer style={{height: 96}}>
        <ContentContainer>
          <Title>{thisMonth}월의 추천질문</Title>
        </ContentContainer>
        <ContentContainer>
          <SmallText>이번달 추천질문입니다.</SmallText>
          <SmallText>이번달도 아름다운 퍼즐을 맞춰보아요!</SmallText>
        </ContentContainer>
      </ScreenContainer>
      <LoadingContainer isLoading={isLoading}>
        <ScrollContainer>
          <ScreenContainer
            style={{backgroundColor: Color.SECONDARY_LIGHT, flex: 1}}>
            <ContentContainer
              style={{alignItems: 'flex-start', height: '100%'}}
              gap={'10px'}>
              {recommendQuestions.map((question, index) => (
                <RecommendQuestionButton
                  order={index + 1}
                  question={question}
                  selected={
                    selectedQuestion !== undefined &&
                    selectedQuestion.questionNo === question.questionNo
                  }
                  onSelect={() => {
                    setSelectedQuestion(question);
                  }}
                />
              ))}
              {
                <RecommendQuestionButton
                  question={undefined}
                  order={recommendQuestions.length + 1}
                  selected={!selectedQuestion}
                  onSelect={() => setSelectedQuestion(undefined)}
                />
              }
            </ContentContainer>
          </ScreenContainer>
        </ScrollContainer>
      </LoadingContainer>
    </>
  );
};

export default PuzzleWritingQuestionPage;
