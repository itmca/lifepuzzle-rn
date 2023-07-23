import React from 'react';
import {WideSelectable} from '../styled/components/Selectable';
import {XSmallTitle} from '../styled/components/Title';
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
  const defaultBackgroundColor =
    order % 2 == 1 ? Color.LIGHT_BLACK : Color.WHITE;
  const defaultFontColor = order % 2 == 1 ? Color.WHITE : Color.BLACK;

  if (!question || question.no < 0) {
    return (
      <WideSelectable
        gap={12}
        backgroundColor={defaultBackgroundColor}
        justifyContents={'center'}
        selected={selected}
        disabled={selected}
        onPress={onSelect}>
        <ContentContainer
          flex={1}
          alignItems={'center'}
          justifyContent={'center'}
          minHeight={42}>
          <XSmallTitle style={{color: defaultFontColor}}>
            선택하지 않음
          </XSmallTitle>
        </ContentContainer>
      </WideSelectable>
    );
  }

  return (
    <WideSelectable
      gap={8}
      backgroundColor={defaultBackgroundColor}
      selected={selected}
      disabled={selected}
      onPress={onSelect}>
      <PuzzleNumber displayNumber={order} />
      <ContentContainer flex={1} justifyContent={'center'} minHeight={40}>
        <XSmallTitle color={defaultFontColor}>{question.text}</XSmallTitle>
      </ContentContainer>
    </WideSelectable>
  );
};
