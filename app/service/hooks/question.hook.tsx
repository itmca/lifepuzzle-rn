import {useState} from 'react';
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

const useRecommendedQuestion = (param?: Param): [Question[], boolean] => {
  const hero = useRecoilValue<HeroType>(heroState);
  const heroNo = hero.heroNo;

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
    },
    disableInitialRequest: false,
  });

  return [
    [
      {questionNo: 1, questionText: '이번 여름 가장 행복했던 일은?'},
      {questionNo: 2, questionText: '이번 여름 가장 신경쓰였던 일은?'},
      {questionNo: 3, questionText: '이번 여름 가장 신경쓰였던 일은?'},
      {questionNo: 4, questionText: '이번 여름 가장 신경쓰였던 일은?'},
    ],
    isLoading,
  ];
};

export {useRecommendedQuestion};
