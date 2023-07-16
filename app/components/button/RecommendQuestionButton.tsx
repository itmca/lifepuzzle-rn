import React from 'react';
import {WideSelectable} from '../styled/components/Selectable';
import {SmallTitle} from '../styled/components/Title';
import {Color} from '../../constants/color.constant';
import {ContentContainer} from '../styled/container/ContentContainer';
import {PuzzleNumber} from '../puzzle/PuzzleNumber';
import {Question} from '../../types/question.type';

type Props = {
  question: Question | undefined;
  order: number;
  selected: boolean;
  onSelect: () => void;
};

export const RecommendQuestionButton = ({
  question,
  order,
  selected = false,
  onSelect,
}: Props): JSX.Element => {
  const backgroundColor = order % 2 == 1 ? Color.BLACK : Color.WHITE;
  const fontColor = order % 2 == 1 ? Color.WHITE : Color.BLACK;

  if (!question || question.questionNo < 0) {
    return (
      <WideSelectable
        gap={12}
        backgroundColor={backgroundColor}
        justifyContents={'center'}
        selected={selected}
        disabled={selected}
        onPress={onSelect}>
        <ContentContainer
          flex={1}
          alignItems={'center'}
          justifyContent={'center'}
          minHeight={36}>
          <SmallTitle style={{color: fontColor}}>선택하지 않음</SmallTitle>
        </ContentContainer>
      </WideSelectable>
    );
  }

  return (
    <WideSelectable
      gap={12}
      backgroundColor={backgroundColor}
      selected={selected}
      disabled={selected}
      onPress={onSelect}>
      <PuzzleNumber displayNumber={order} />
      <ContentContainer flex={1} justifyContent={'center'} minHeight={42}>
        <SmallTitle style={{color: fontColor}}>
          {question.questionText}
        </SmallTitle>
      </ContentContainer>
    </WideSelectable>
  );
};
