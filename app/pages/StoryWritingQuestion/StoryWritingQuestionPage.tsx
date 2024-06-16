import React, {useEffect, useState} from 'react';
import {useRecommendedQuestion} from '../../service/hooks/question.hook';
import {useSetRecoilState} from 'recoil';
import {writingStoryState} from '../../recoils/story-write.recoil';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {SmallText} from '../../components/styled/components/Text';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {SmallTitle} from '../../components/styled/components/Title';
import dayjs from 'dayjs';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {Color} from '../../constants/color.constant';
import {RecommendQuestionButton} from './RecommendQuestionButton';
import {ScrollContainer} from '../../components/styled/container/ScrollContainer';
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
            </ContentContainer>
          </ScreenContainer>
        </ScrollContainer>
      </LoadingContainer>
    </>
  );
};

export default StoryWritingQuestionPage;
