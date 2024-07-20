import React, {useEffect, useState} from 'react';
import {useRecommendedQuestion} from '../../service/hooks/question.hook';
import {useSetRecoilState} from 'recoil';
import {writingStoryState} from '../../recoils/story-write.recoil';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {SmallText} from '../../components/styled/components/Text';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer';
import {SmallTitle} from '../../components/styled/components/Title';
import dayjs from 'dayjs';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {Color} from '../../constants/color.constant';
import {RecommendQuestionButton} from './RecommendQuestionButton';
import {Question} from '../../types/question.type';

const StoryWritingQuestionPage = (): JSX.Element => {
  const setWritingStory = useSetRecoilState(writingStoryState);
  const [selectedQuestion, setSelectedQuestion] = useState<
    Question | undefined
  >(undefined);

  useEffect(() => {
    if (!selectedQuestion) {
      setWritingStory({
        recQuestionNo: undefined,
        helpQuestionText: undefined,
      });
      return;
    }

    setWritingStory({
      recQuestionNo: selectedQuestion.no,
      helpQuestionText: selectedQuestion.text,
    });
  }, [selectedQuestion]);

  const [recommendQuestions, isLoading] = useRecommendedQuestion();

  const thisMonth = dayjs().format('M');

  return (
    <ScreenContainer gap={0}>
      <ContentContainer withScreenPadding>
        <ContentContainer>
          <SmallTitle>{thisMonth}월의 추천질문</SmallTitle>
        </ContentContainer>
        <ContentContainer gap={4}>
          <SmallText color={Color.DARK_GRAY}>이번달 추천질문입니다.</SmallText>
          <SmallText color={Color.DARK_GRAY}>
            이번달도 아름다운 퍼즐을 맞춰보아요!
          </SmallText>
        </ContentContainer>
      </ContentContainer>
      <LoadingContainer isLoading={isLoading}>
        <ScrollContentContainer withScreenPadding gap={8}>
          {recommendQuestions.map((question, index) => (
            <RecommendQuestionButton
              key={index}
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
          <RecommendQuestionButton
            order={recommendQuestions.length + 1}
            selected={selectedQuestion != null && selectedQuestion.no < 0}
            onSelect={() => setSelectedQuestion({no: -1, text: ''})}
          />
        </ScrollContentContainer>
      </LoadingContainer>
    </ScreenContainer>
  );
};

export default StoryWritingQuestionPage;
