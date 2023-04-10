import {useEffect, useState} from 'react';
import {useAxios} from './network.hook';
import {useRecoilValue} from 'recoil';
import {HeroType} from '../../types/hero.type';
import {heroState} from '../../recoils/hero.recoil';
import {Question} from '../../types/question.type';

type Param = {
  category?: string;
  defaultQuestion?: Question;
  onRecommendQuestionChanged: (recommendQuestion: Question) => void;
};

type QuestionDTO = {
  questionNo: number;
  category?: string;
  question: string;
};

const useRecommendedQuestion = (
  param?: Param,
): [Question, () => void, boolean] => {
  const hero = useRecoilValue<HeroType>(heroState);
  const heroNo = hero.heroNo;
  const defaultQuestion = param?.defaultQuestion || {
    questionText: '',
    questionNo: -1,
  };

  const [preparedQuestions, setPreparedQuestions] = useState<Question[]>([]);

  const [isLoading, fetchQuestions] = useAxios<QuestionDTO[]>({
    requestOption: {
      url: `/question/recommend?heroNo=${heroNo}`,
    },
    onResponseSuccess: responseQuestions => {
      setPreparedQuestions(
        responseQuestions?.map(q => ({
          questionNo: q.questionNo,
          category: q.category,
          questionText: q.question,
        })) ?? [],
      );
      setQuestionIndex(-1);
    },
    disableInitialRequest: false,
  });

  useEffect(() => {
    fetchQuestions({});
  }, [heroNo]);

  const [questionIndex, setQuestionIndex] = useState(-1);

  useEffect(() => {
    if (
      questionIndex >= 0 &&
      typeof param?.onRecommendQuestionChanged === 'function'
    ) {
      param?.onRecommendQuestionChanged(preparedQuestions[questionIndex]);
    }
  }, [questionIndex]);

  const changer = () => {
    setQuestionIndex((questionIndex + 1) % preparedQuestions.length);
  };

  return [
    questionIndex > -1 ? preparedQuestions[questionIndex] : defaultQuestion,
    changer,
    isLoading,
  ];
};

export {useRecommendedQuestion};
