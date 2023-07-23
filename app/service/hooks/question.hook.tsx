import {useState} from 'react';
import {useAxios} from './network.hook';
import {useRecoilValue} from 'recoil';
import {HeroType} from '../../types/hero.type';
import {heroState} from '../../recoils/hero.recoil';
import {Question} from '../../types/question.type';
import dayjs from 'dayjs';

type QuestionDTO = {
  questionNo: number;
  category?: string;
  question: string;
};

const useRecommendedQuestion = (): [Question[], boolean] => {
  const hero = useRecoilValue<HeroType>(heroState);
  const heroNo = hero.heroNo ?? -1;

  const [recommendQuestions, setRecommendQuestions] = useState<Question[]>([]);

  const [isLoading] = useAxios<QuestionDTO[]>({
    requestOption: {
      url: `/questions/month-recommend?heroNo=${heroNo}&month=${dayjs().format(
        'M',
      )}`,
    },
    onResponseSuccess: responseQuestions => {
      setRecommendQuestions(
        responseQuestions?.map(q => ({
          no: q.questionNo,
          category: q.category,
          text: q.question,
        })) ?? [],
      );
    },
    disableInitialRequest: false,
  });

  return [recommendQuestions, isLoading];
};

export {useRecommendedQuestion};
